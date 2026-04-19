const { Schema, model } = require('mongoose');

const absenceSchema = new Schema({
    enrollment: { 
        type: Schema.Types.ObjectId, 
        ref: 'Enrollment', 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['absent', 'late', 'excused', 'present'], 
        required: true 
    },
    reason: { 
        type: String, 
        trim: true 
    },
    recordedBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'Faculty' 
    }
}, { timestamps: true });

module.exports = model('Absence', absenceSchema);