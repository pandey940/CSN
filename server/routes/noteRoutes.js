const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// Get all notes with filtering, search, and sorting
router.get('/', async (req, res) => {
    try {
        const filters = {};
        
        // Basic Filters
        if (req.query.subject) filters.subject = req.query.subject;
        if (req.query.college && req.query.college !== 'All Colleges') filters.college = req.query.college;
        if (req.query.course) filters.course = req.query.course;
        if (req.query.branch) filters.branch = req.query.branch;
        if (req.query.semester) filters.semester = parseInt(req.query.semester);
        if (req.query.year) filters.year = req.query.year;
        if (req.query.fileType) filters.fileType = req.query.fileType;
        if (req.query.status) filters.status = req.query.status;
        if (req.query.minRating) filters.rating = { $gte: parseFloat(req.query.minRating) };
        if (req.query.author) filters.author = req.query.author;

        // Search Query (Full-text search simulation)
        if (req.query.q) {
            filters.$or = [
                { title: { $regex: req.query.q, $options: 'i' } },
                { description: { $regex: req.query.q, $options: 'i' } },
                { subject: { $regex: req.query.q, $options: 'i' } }
            ];
        }

        // Sorting
        let sort = { createdAt: -1 }; // Default: Newest
        if (req.query.sort === 'downloads') sort = { downloadCount: -1 };
        if (req.query.sort === 'rating') sort = { rating: -1 };
        if (req.query.sort === 'newest') sort = { createdAt: -1 };

        const notes = await Note.find(filters).sort(sort);
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single note by ID
router.get('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new note
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const note = new Note({
            title: req.body.title,
            description: req.body.description,
            subject: req.body.subject,
            college: req.body.college,
            course: req.body.course,
            branch: req.body.branch,
            semester: req.body.semester,
            year: req.body.year,
            fileType: 'PDF',
            author: req.body.author,
            fileUrl: `/uploads/${req.file.filename}`,
            authorAvatar: req.body.authorAvatar,
            thumbnail: 'https://cdn-icons-png.flaticon.com/512/337/337946.png', // Generic PDF icon
        });

        const newNote = await note.save();
        res.status(201).json(newNote);
    } catch (err) {
        console.error('--- UPLOAD ERROR START ---');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        if (err.errors) console.error('Validation Errors:', err.errors);
        console.error('Request Body:', req.body);
        console.error('Request File:', req.file);
        console.error('--- UPLOAD ERROR END ---');
        res.status(400).json({ 
            message: 'Note storage failed: ' + err.message,
            details: err.errors
        });
    }
});

// Increment view count
router.patch('/:id/view', async (req, res) => {
    try {
        const note = await Note.findByIdAndUpdate(
            req.params.id, 
            { $inc: { viewCount: 1 } }, 
            { new: true }
        );
        if (!note) return res.status(404).json({ message: 'Note not found' });
        
        console.log(`View count incremented for note: ${note.title}. New count: ${note.viewCount}`);
        res.json({ viewCount: note.viewCount });
    } catch (err) {
        console.error('Increment view error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Update a note (e.g., status, rating)
router.patch('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        if (req.body.title) note.title = req.body.title;
        if (req.body.status) note.status = req.body.status;
        if (req.body.rating) note.rating = req.body.rating;
        if (req.body.moderatorComment) note.moderatorComment = req.body.moderatorComment;
        
        const updatedNote = await note.save();
        res.json(updatedNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Download a note (with S3 signed URL and daily limit)
router.get('/:id/download', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        // Logic for user daily limit (Assuming user ID is passed or from JWT)
        // For now, we simulation limit check
        const userId = req.headers['user-id']; // Mock auth header
        if (userId) {
            const User = require('../models/User');
            const user = await User.findById(userId);
            if (user) {
                const today = new Date().toDateString();
                if (user.lastDownloadDate.toDateString() !== today) {
                    user.dailyDownloadCount = 0;
                    user.lastDownloadDate = new Date();
                }

                if (user.dailyDownloadCount >= 20) {
                    return res.status(429).json({ message: 'Daily download limit reached (20 files/day)' });
                }

                user.dailyDownloadCount += 1;
                user.downloadHistory.push({ noteId: note._id });
                await user.save();
            }
        }

        note.downloadCount += 1;
        await note.save();

        // Simulate S3 Signed URL
        const signedUrl = `${note.fileUrl}?token=simulated_s3_token_ttl_15min`;
        res.json({ downloadUrl: signedUrl });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a note
router.delete('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: 'Note not found' });
        await note.deleteOne();
        res.json({ message: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
