const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single user by ID (for profile info)
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new user (Signup simulation)
router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        role: req.body.role,
        avatar: req.body.avatar,
        college: req.body.college,
        specialization: req.body.specialization,
        semester: req.body.semester,
        bio: req.body.bio,
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a user's stats
router.patch('/:id/stats', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (req.body.totalUploads) user.stats.totalUploads = req.body.totalUploads;
        if (req.body.avgRating) user.stats.avgRating = req.body.avgRating;
        if (req.body.totalSaves) user.stats.totalSaves = req.body.totalSaves;
        if (req.body.totalDownloads) user.stats.totalDownloads = req.body.totalDownloads;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
