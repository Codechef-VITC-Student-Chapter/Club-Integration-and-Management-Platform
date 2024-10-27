import mongoose from "mongoose";

const depsSchema = new mongoose.Schema({
    depId: {
        type: String,
        required: true
    },
    depName: {
        type: String,
        required: true
    },
    clubId: {
        type: String,
        ref: 'Club',
        required: true
    },
    leads: {
        type: [String],
        ref: 'User',
        required: false,
        default: []
    },
    subDeps: {
        type: [String],
        ref: 'Department',
        required: false,
        default: []
    }
});

export default depsSchema;
