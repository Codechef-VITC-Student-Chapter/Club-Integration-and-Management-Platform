import mongoose from 'mongoose';

const contSchema = new mongoose.Schema({
    ID: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    proofFiles: {
        type: [String], 
        default: []
    },
    target: {
        type: String,
        required: true
    },
    clubId: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Contribution', contSchema);
