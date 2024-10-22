import mongoose from 'mongoose';

const contSchema = new mongoose.Schema({
    cont_id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    user: {
        type: String,
        ref: 'User',
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    proof_files: {
        type: [String], 
        default: []
    },
    target: {
        type: String,
        required: true
    },
    club: {
        type: String,
        ref: 'Club',
        required: true
    },
    dep: {
        type: String,
        ref: 'Department',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Contribution', contSchema);
