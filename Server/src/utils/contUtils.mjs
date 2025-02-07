import mongoose from "mongoose";
import dotenv from "dotenv";
import contributionSchema from "../DB/Schemas/contSchema.mjs";
import userSchema from "../DB/Schemas/userSchema.mjs";

dotenv.config();

// const connectionString = process.env.CONNECTION_STRING;

// mongoose
//   .connect(connectionString)
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const Contribution =
  mongoose.models.Contribution ||
  mongoose.model("Contribution", contributionSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);

export const addContribution = async (contributionData) => {
  try {
    const newContribution = new Contribution(contributionData);
    await newContribution.save();
    await User.findOneAndUpdate(
      { id: contributionData.user_id },
      { $push: { contributions: newContribution.id } },
      { new: true }
    );
    return newContribution;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to add contribution");
  }
};

export const removeContribution = async (contId) => {
  try {
    const deletedContribution = await Contribution.findOneAndDelete({
      ID: contId,
    });
    if (!deletedContribution) {
      throw new Error("Contribution not found");
    }
    return deletedContribution;
  } catch (error) {
    throw new Error("Failed to remove contribution");
  }
};

export const getContributionById = async (contId) => {
  try {
    const contribution = await Contribution.findOne({ id: contId });
    if (!contribution) {
      throw new Error("Contribution not found");
    }
    return contribution;
  } catch (error) {
    throw new Error("Failed to fetch contribution");
  }
};

export const getRequests = async (uid) => {
  try {
    const requests = await Contribution.find({ target: uid });
    // console.log(requests);
    if (!requests) {
      return { requests: [] };
    }
    return requests;
  } catch (error) {
    throw new Error("Failed to fetch requests: " + error.message);
  }
};

export const updateContributionStatus = async (contId, newStatus) => {
  try {
    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(newStatus)) {
      throw new Error("Invalid status");
    }

    const contribution = await Contribution.findOne({ id: contId });
    if (!contribution) {
      throw new Error("Contribution not found");
    }

    const oldStatus = contribution.status;
    contribution.status = newStatus;
    await contribution.save();

    // Update user's total points if contribution is approved
    if (newStatus === 'approved' && oldStatus !== 'approved') {
      await User.findOneAndUpdate(
        { id: contribution.user_id },
        { $inc: { totalPoints: contribution.points } }
      );
    }

    return contribution;
  } catch (error) {
    throw new Error("Failed to update contribution status");
  }
};