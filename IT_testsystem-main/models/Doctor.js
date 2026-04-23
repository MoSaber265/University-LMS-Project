const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: String, required: true, default: 'Computer Science', trim: true },
    title: { type: String, enum: ['Professor', 'Doctor', 'TA'], default: 'Doctor' },
    specialization: { type: String, default: 'Expert in Software Engineering' }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

doctorSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'doctorId'
});

module.exports = mongoose.model('Doctor', doctorSchema);