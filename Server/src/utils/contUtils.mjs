import mongoose from "mongoose";
import dotenv from "dotenv";
import { Contribution } from "../DB/Schemas/contSchema.mjs";
import { User } from "../DB/Schemas/userSchema.mjs";

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

// const Contribution =
//   mongoose.models.Contribution ||
//   mongoose.model("Contribution", contributionSchema);
// const User = mongoose.models.User || mongoose.model("User", userSchema);

export const addContribution = async (contributionData) => {
  try {
    if (
      !Array.isArray(contributionData.target) ||
      contributionData.target.length === 0
    ) {
      throw new Error("Target must be a non-empty array of strings.");
    }

    const primaryTarget = contributionData.target[0]; // First element as target
    const secondaryTargets = contributionData.target.slice(1); // Rest as secTargets

    const newContribution = new Contribution({
      ...contributionData,
      target: primaryTarget,
      secTargets: secondaryTargets,
    });

    await newContribution.save();
    await User.findOneAndUpdate(
      { id: contributionData.user_id },
      {
        $push: { contributions: newContribution.id },
        ...(contributionData.status === "approved" && {
          $inc: { total_points: contributionData.points },
        }),
      },
      { new: true }
    );
    return newContribution;
  } catch (error) {
    console.log("Detailed error:", error);
    throw new Error("Failed to add contribution: " + error.message);
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
    const requests = await Contribution.find({
      $or: [{ target: uid }, { secTargets: uid }],
    });

    return requests;
  } catch (error) {
    throw new Error("Failed to fetch requests: " + error.message);
  }
};

export const updateContributionStatus = async (
  contId,
  newStatus,
  reason = ""
) => {
  //reason added
  try {
    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(newStatus)) {
      throw new Error("Invalid status");
    }
    const updatedContribution = await Contribution.findOneAndUpdate(
      { id: contId },
      { status: newStatus, reason }, //reason added
      { new: true }
    );
    if (!updatedContribution) {
      throw new Error("Contribution not found");
    }
    // console.log(updatedContribution);
    const user_id = updatedContribution.user_id;
    const user = await User.findOne({ id: user_id });
    user.last_update = Date.now();
    if (newStatus === "approved") {
      user.total_points += updatedContribution.points;
    } else if (newStatus === "rejected") {
      user.total_points -= updateContributionStatus.points;
    }
    await user.save();
    // console.log(user.modifiedCount);
    return updatedContribution;
  } catch (error) {
    throw new Error("Failed to update contribution status");
  }
};
