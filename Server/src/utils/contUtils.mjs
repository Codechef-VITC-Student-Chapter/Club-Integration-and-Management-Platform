import mongoose from 'mongoose';
import dotenv from 'dotenv';
import contributionSchema from '../DB/Schemas/contSchema.mjs';

dotenv.config();

const connectionString = process.env.CONNECTION_STRING;

mongoose
  .connect(connectionString)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

const Contribution =
  mongoose.models.Contribution ||
  mongoose.model('Contributions', contributionSchema);

export const addContribution = async (contributionData) => {
  try {
    const newContribution = new Contribution(contributionData);
    await newContribution.save();
    return newContribution;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to add contribution');
  }
};

export const removeContribution = async (contId) => {
  try {
    const deletedContribution = await Contribution.findOneAndDelete({
      cont_id: contId,
    });
    if (!deletedContribution) {
      throw new Error('Contribution not found');
    }
    return deletedContribution;
  } catch (error) {
    throw new Error('Failed to remove contribution');
  }
};

export const getContributionById = async (contId) => {
  try {
    const contribution = await Contribution.findOne({ cont_id: contId });
    if (!contribution) {
      throw new Error('Contribution not found');
    }
    return contribution;
  } catch (error) {
    throw new Error('Failed to fetch contribution');
  }
};

export const getRequests = async (uid) => {
  try {
    const requests = await Contribution.find({ target: uid });
    if (!requests) {
      return { requests: [] };
    }
    return requests;
  } catch (error) {
    throw new Error('Failed to fetch requests' + error.message);
  }
};

export const updateContributionStatus = async (contId, newStatus) => {
  try {
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error('Invalid status');
    }
    const updatedContribution = await Contribution.findOneAndUpdate(
      { cont_id: contId },
      { status: newStatus },
      { new: true }
    );
    if (!updatedContribution) {
      throw new Error('Contribution not found');
    }
    return updatedContribution;
  } catch (error) {
    throw new Error('Failed to update contribution status');
  }
};
