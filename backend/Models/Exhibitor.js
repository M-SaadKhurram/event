const mongoose = require('mongoose');

const exhibitorSchema = new mongoose.Schema({
    expo_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expo',
        required: true
    },
    company_name: {
        type: String,
        required: true
    },
    product_description: {
        type: String,
        default: ''
    },
    booth_selection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booth',
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    contact_info: {
        type: Object, // JSON { email, phone }
        required: true
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Exhibitor', exhibitorSchema);
