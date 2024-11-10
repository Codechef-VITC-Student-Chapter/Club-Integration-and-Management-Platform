import mongoose from "mongoose";

const depsSchema = new mongoose.Schema({
    ID: {
        type: String,
        required: true
    },
    depName: {
        type: String,
        required: true
    },
    clubId: {
        type: String,
        required: true
    },
    leads: {
        type: [String],
        required: false,
        default: []
    },
    subDeps: {
        type: [String],
        required: false,
        default: []
    }
});

export default depsSchema;