const mongoose = require('mongoose');

const absenceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    lectureAbsences: { type: Number, default: 0 },    // غياب المحاضرات
    sectionAbsences: { type: Number, default: 0 },    // غياب السكاشن
    totalAbsences: { type: Number, default: 0 },
    semester: { type: String, default: 'الفصل الأول 2024' }
}, { timestamps: true });

// حساب totalAbsences تلقائياً قبل الحفظ
absenceSchema.pre('save', function(next) {
    this.totalAbsences = this.lectureAbsences + this.sectionAbsences;
    next();
});

module.exports = mongoose.model('Absence', absenceSchema);