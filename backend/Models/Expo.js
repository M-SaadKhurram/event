const mongoose = require('mongoose');

const expoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    theme: {
        type: String
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    floors: {
        type: Number,
        required: true
    },
    attachment: {
        type: String // Image path
    }
}, { timestamps: true });

module.exports = mongoose.model('Expo', expoSchema);
