const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google OAuth users
    googleId: { type: String },
    role: { type: String, enum: ['Student', 'Admin', 'Moderator'], default: 'Student' },
    avatar: { type: String },
    college: { type: String },
    branch: { type: String },
    semester: { type: Number },
    bio: { type: String },
    isVerified: { type: Boolean, default: false },
    otpCode: { type: String },
    otpExpires: { type: Date },
    refreshTokens: [String],
    stats: {
        totalUploads: { type: Number, default: 0 },
        avgRating: { type: Number, default: 0 },
        totalSaves: { type: Number, default: 0 },
        totalDownloads: { type: Number, default: 0 },
    },
    downloadHistory: [{
        noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' },
        downloadedAt: { type: Date, default: Date.now }
    }],
    dailyDownloadCount: { type: Number, default: 0 },
    lastDownloadDate: { type: Date, default: Date.now },
    savedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
    uploads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
