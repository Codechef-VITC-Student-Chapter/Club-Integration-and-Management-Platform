import { Schema } from 'mongoose';

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  reg_number: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    default:"",
    required: false,
  },
  is_lead: {
    type: Boolean,
    default: false,
    required: true,
  },
  departments: {
    type: [String],
    default: [],
  },
  clubs: {
    type: [String],
    default: [],
    required: false,
  },
  contributions: {
    type: [String],
    default: [],
    required: false,
  },
  resetAccessCode: {
    type: String,
    default:"",
    required: false,
  }

});

export default userSchema;
