import mongoose from "mongoose";

const depsSchema = new mongoose.Schema({
    dep_id: {
        type: String,
        required: true
    },
    dep_name: {
        type: String,
        required: true
    },
    club_id: {
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
    subdeps: {
        type: [String],
        ref: 'Department',
        required: false,
        default: []
    }
});

export default depsSchema;