import mongoose from 'mongoose';

const depsSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  department_name: {
    type: String,
    required: true,
  },
  club_id: {
    type: String,
    required: true,
  },
  department_leads: {
    type: [String],
    required: false,
    default: [],
  },
  sub_departments: {
    type: [String],
    required: false,
    default: [],
  },
});

export default depsSchema;
