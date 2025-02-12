import mongoose from 'mongoose';

const depsSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  club_id: {
    type: String,
    required: true,
  },
  leads: {
    type: [String],
    required: false,
    default: [],
  },
  sub_departments: {
    type: [String],
    required: false,
    default: [],
  },
  tasks: [
    {
      title: {
        type: String,
        required: true,
      },
      points: {
        type: Number,
        required: true,
      },
    },
  ],
});

export default depsSchema;
