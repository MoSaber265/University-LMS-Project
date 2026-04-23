const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['PDF', 'Video', 'Assignment', 'Lab'], default: 'PDF' },
    link: { type: String, required: true },
    description: { type: String, maxLength: 200 },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);