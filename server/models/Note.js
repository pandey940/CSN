const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    college: { type: String, required: true },
    course: { type: String, required: true },
    branch: { type: String, required: true },
    semester: { type: Number, required: true },
    year: { type: String, enum: ['1st', '2nd', '3rd', '4th'], required: true },
    rating: { type: Number, default: 0 },
    fileType: { type: String, required: true }, // e.g., 'PDF', 'JPG'
    status: { type: String, enum: ['Approved', 'Pending', 'Rejected'], default: 'Pending' },
    downloadCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    author: { type: String, required: true },
    authorAvatar: { type: String },
    thumbnail: { type: String },
    fileUrl: { type: String, required: true },
    moderatorComment: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Note', noteSchema);
