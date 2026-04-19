const { Schema, model } = require('mongoose');

const studentSchema = new Schema({
    name: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    department: { type: String, required: true },
    profileImage: { type: String, default: 'default-profile.png' }
}, { timestamps: true });

module.exports = model('Student', studentSchema);