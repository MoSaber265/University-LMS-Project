const { Schema, model } = require('mongoose');

const gradeSchema = new Schema({
    enrollment: { 
        type: Schema.Types.ObjectId, 
        ref: 'Enrollment', 
        required: true 
    },
    grade: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 100 
    },
    letterGrade: { 
        type: String, 
        enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'] 
    },
    semester: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

module.exports = model('Grade', gradeSchema);