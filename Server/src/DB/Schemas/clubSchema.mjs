import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
    clubId: {
        type: String,
        required: true,
        unique: true,
    },
    clubName: {
        type: String,
        required: true
    },
    clubLeads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    clubDeps: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        default: []
    }]
});

export default mongoose.model('Club', clubSchema);
