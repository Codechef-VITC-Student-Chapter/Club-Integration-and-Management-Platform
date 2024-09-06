import { Schema } from 'mongoose';

const userSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    reg_no: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
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