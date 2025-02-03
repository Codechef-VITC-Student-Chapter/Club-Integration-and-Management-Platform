import mongoose from 'mongoose';

const contSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  proof_files: {
    type: [String],
    default: [],
  },
  target: {
    type: String,
    required: true,
  },
  club_id: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Contribution', contSchema);
