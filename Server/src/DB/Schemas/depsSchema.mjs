import mongoose from "mongoose";

const depsSchema = new mongoose.Schema({
    ID: {
        type: String,
        required: true
    },
    departmentName: {
        type: String,
        required: true
    },
    clubId: {
        type: String,
        required: true
    },
    departmentLeads: {
        type: [String],
        required: false,
        default: []
    },
    subDepartments: {
        type: [String],
        required: false,
        default: []
    }
});

export default depsSchema;