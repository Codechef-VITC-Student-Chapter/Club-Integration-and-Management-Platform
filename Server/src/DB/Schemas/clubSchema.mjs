import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
    club_id: {
        type: String,
        required: true
    },
    cname: {
        type: String,
        required: true
    },
    club_leads: {
        type: [String],
        ref: 'User',
        default: []
    },
    club_deps: {
        type: [String],
        ref: 'Department',
        default: []
    }
});

export default mongoose.model('Club', clubSchema);