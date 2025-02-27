import mongoose from "mongoose";

const clubSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  leads: {
    type: [String],
    default: [],
  },
  departments: {
    type: [String],
    default: [],
  },
});

export const Club = mongoose.models.Club || mongoose.model("Club", clubSchema);

// export default mongoose.model('Club', clubSchema);
