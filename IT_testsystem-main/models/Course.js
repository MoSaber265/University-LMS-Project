const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    academicYear: { type: Number, required: true, enum: [1, 2, 3, 4] },
    semester: { type: Number, required: true, enum: [1, 2] }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);