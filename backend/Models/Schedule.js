const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    expo_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Expo', 
        required: true 
    },
    session_name: { 
        type: String, 
        required: true 
    },
    time_slot: { 
        start: { type: Date, required: true },
        end: { type: Date, required: true }
    },
    speaker: { 
        type: String, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        default: '' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
