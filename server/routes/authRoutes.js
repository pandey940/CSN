const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTPEmail } = require('../services/emailService');

// Register User
router.post('/signup', async (req, res) => {
    try {
        console.log('Signup request received:', req.body);
        const { name, email, password, college, branch, semester } = req.body;

        if (!name || !email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP (Simulated for now)
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

        user = new User({
            name,
            email,
            password: hashedPassword,
            college,
            branch,
            semester: parseInt(semester) || 1,
            otpCode,
            otpExpires
        });

        await user.save();
        
        // Send OTP via Email
        const emailSent = await sendOTPEmail(email, otpCode);
        
        if (!emailSent) {
            console.log(`Failed to send email to ${email}, OTP: ${otpCode}`);
        } else {
            console.log(`User created and OTP sent to: ${email}`);
        }

        res.status(201).json({ 
            message: 'User registered. Please verify OTP sent to email.',
            otp: process.env.NODE_ENV !== 'production' ? otpCode : undefined
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

        // Generate new OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000;

        user.otpCode = otpCode;
        user.otpExpires = otpExpires;
        await user.save();

        const emailSent = await sendOTPEmail(email, otpCode);
        if (!emailSent) {
            console.log(`Failed to resend email to ${email}, OTP: ${otpCode}`);
            if (process.env.NODE_ENV !== 'production') {
                return res.json({ 
                    message: 'Failed to send email, but a new OTP was generated for development.',
                    otp: otpCode 
                });
            }
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }

        res.json({ message: 'New OTP sent to email' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otpCode !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otpCode = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: 'Email verified successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);

        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        if (!user.isVerified) {
            console.log('User not verified:', email);
            return res.status(401).json({ message: 'Please verify your email first' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate Tokens
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret', { expiresIn: '7d' });

        user.refreshTokens.push(refreshToken);
        await user.save();
        console.log('Login successful for:', email);

        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                college: user.college,
                branch: user.branch,
                semester: user.semester
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
