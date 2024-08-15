import { Schema } from 'mongoose';

const userSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    reg_no: {
        type: String,
        required: true
    },
    password_hash: {
        type: String,
        required: true
    },
    deps: {
        type: [String],
        default: []
    },
    clubs: {
        type: [String],
        default: []
    },
    contributions: {
        type: [String],
        default: []
    }
});


export default userSchema;