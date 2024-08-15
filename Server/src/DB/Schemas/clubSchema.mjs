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
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    club_dep: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Department',
        default: []
    }
});

export default mongoose.model('Club', clubSchema);