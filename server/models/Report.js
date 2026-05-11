const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
    type: { type: String, enum: ['Copyright Claim', 'Inaccurate Content', 'Spam', 'Harassment', 'Other'], required: true },
    reportedBy: { type: String, required: true }, // For simplicity, just author name for now
    details: { type: String },
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', reportSchema);
