const { Schema, model } = require('mongoose');

const enrollmentSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    semester: { type: String, required: true, enum: ['1', '2', '3', '4', '5', '6', '7', '8'] },
    enrollmentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'dropped', 'completed', 'withdrawn'], default: 'active' },
    attendancePercentage: { type: Number, default: 100, min: 0, max: 100 }
}, { timestamps: true });


enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = model('Enrollment', enrollmentSchema);