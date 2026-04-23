const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    type: { type: String, required: true, trim: true }, // مثال: Midterm, Final
    grade: { type: Number, required: true, min: 0 },
    totalGrade: { type: Number, default: 100, min: 1 },
    semester: { type: String, default: 'Fall 2024' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

// التحقق من أن درجة الطالب لا تتعدى الدرجة النهائية
gradeSchema.pre('save', function(next) {
    if (this.grade > this.totalGrade) {
        next(new Error('Student grade cannot exceed the total grade!'));
    } else {
        next();
    }
});

module.exports = mongoose.model('Grade', gradeSchema);