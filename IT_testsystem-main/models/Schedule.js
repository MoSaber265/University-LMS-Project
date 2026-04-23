const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    day: { type: String, enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    room: { type: String, default: 'Hall 101', trim: true },
    type: { type: String, enum: ['Lecture', 'Section', 'Lab'], default: 'Lecture' }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);