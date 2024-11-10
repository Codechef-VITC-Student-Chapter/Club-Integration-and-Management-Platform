import { Schema } from 'mongoose';

const userSchema = new Schema({
    ID: {
        type: String,
        required: true,
        unique: true
    },
    registrationNumber: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    isLead: {
        type: Boolean,
        default: false,
        required: true     
    },
    departments: {
        type: [String],
        default: []
    },
    clubs: {
        type: [String],
        default: [],
        required: false
    },
    contributions: {
        type: [String],
        default: [],
        required: false
    }
});

export default userSchema;