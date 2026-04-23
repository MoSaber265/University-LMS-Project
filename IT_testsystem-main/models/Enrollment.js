const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    semester: { type: String, default: 'الفصل الأول 2024' },
    // ضيف السطر ده عشان الدرجات تتخزن
    grade: { type: Number, default: 0 } 
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);