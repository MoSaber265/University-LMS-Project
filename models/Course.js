const { Schema, model } = require('mongoose');

const courseSchema = new Schema({
    title: {
         type: String, 
         required: true, 
         trim: true
         },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    credits: { type: Number, required: true, min: 1, max: 6 },
    description: { type: String, trim: true },
    faculty: { type: Schema.Types.ObjectId, ref: 'Faculty', required: true }, // شوف السطر بقى نظيف إزاي
    maxStudents: { type: Number, default: 50 },
    semester: { type: String, enum: ['1', '2', '3', '4', '5', '6', '7', '8'], required: true }
}, { timestamps: true });

module.exports = model('Course', courseSchema);