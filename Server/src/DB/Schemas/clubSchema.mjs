import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
    ID: {
        type: String,
        required: true,
        unique: true,
    },
    clubName: {
        type: String,
        required: true
    },
    clubLeads: {
        type: [String],
        default: []
    },
    departments: {
        type: [String],
        default: []
    }
});

export default mongoose.model('Club', clubSchema);
