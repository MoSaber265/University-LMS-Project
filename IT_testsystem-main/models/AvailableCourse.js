const mongoose = require('mongoose');

const availableCourseSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    department: { type: String, required: true },    // القسم المسموح له
    level: { type: Number, required: true },         // السنة المسموح لها
    semester: { type: String, required: true },      // الترم المسموح به
    capacity: { type: Number, default: 50 },
    enrolledCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('AvailableCourse', availableCourseSchema);