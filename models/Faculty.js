const { Schema, model } = require('mongoose');

const facultySchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, trim: true },
    department: {
        type: String,
        required: true,
        enum: ['IT', 'Engineering', 'Business', 'Pharmacy', 'Other']
    },
    // ← إضافة مهمة
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }]
}, { timestamps: true });

module.exports = model('Faculty', facultySchema);