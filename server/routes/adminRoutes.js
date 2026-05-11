const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const Note = require('../models/Note');

// Get all reports
router.get('/reports', async (req, res) => {
    try {
        const reports = await Report.find().populate('note').sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a report (e.g., status)
router.patch('/reports/:id', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        if (req.body.status) report.status = req.body.status;
        
        const updatedReport = await report.save();
        res.json(updatedReport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Create a new report
router.post('/reports', async (req, res) => {
    const report = new Report({
        note: req.body.noteId,
        type: req.body.type,
        reportedBy: req.body.reportedBy,
        details: req.body.details,
    });

    try {
        const newReport = await report.save();
        res.status(201).json(newReport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
