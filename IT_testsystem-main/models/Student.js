const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: String, default: 'General', uppercase: true, trim: true },
    level: { type: Number, default: 1, min: 1, max: 4 },
    semester: { type: String, enum: ['First', 'Second', 'Summer'], default: 'First' },
    gpa: { type: Number, default: 0.0, min: 0, max: 4.0 },
    totalCredits: { type: Number, default: 0 }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

studentSchema.virtual('enrolledCourses', {
    ref: 'Enrollment',
    localField: 'userId',
    foreignField: 'studentId'
});

module.exports = mongoose.model('Student', studentSchema);