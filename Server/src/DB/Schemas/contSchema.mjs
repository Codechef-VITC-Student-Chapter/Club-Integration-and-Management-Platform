import mongoose from 'mongoose';

const contSchema = new mongoose.Schema({
    contId: {
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
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
