const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: `"The Academic Curator" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Email Verification OTP',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <h2 style="color: #3626cc; text-align: center;">Verify Your Account</h2>
                <p>Thank you for joining <strong>The Academic Curator</strong>. Use the following 6-digit OTP to complete your registration:</p>
                <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #1e293b;">${otp}</span>
                </div>
                <p>This code will expire in 10 minutes.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                <p style="font-size: 12px; color: #64748b; text-align: center;">If you didn't request this email, please ignore it.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP Email sent to ${email}`);
        return true;
    } catch (err) {
        console.error('Email sending error:', err);
        return false;
    }
};

module.exports = { sendOTPEmail };
