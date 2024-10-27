import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
    clubId: {
        type: String,
        required: true
    },
    clubName: {
        type: String,
        required: true
    },
    clubLeads: {
        type: [String],
        ref: 'User',
        default: []
    },
    clubDeps: {
        type: [String],
        ref: 'Department',
        default: []
    }
});

export default mongoose.model('Club', clubSchema);