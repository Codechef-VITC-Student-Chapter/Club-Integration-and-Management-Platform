import mongoose from "mongoose";
import dotenv from "dotenv";
import contributionSchema from "../DB/Schemas/contSchema.mjs";
import userSchema from "../DB/Schemas/userSchema.mjs";

dotenv.config();

const Contribution = mongoose.models.Contribution || mongoose.model("Contribution", contributionSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);

async function updateTotalPoints() {
  try {
    console.log('Starting update of user total points...');
    
    const users = await User.find({});
    console.log(`Found ${users.length} users to update`);

    for (const user of users) {
      const contributions = await Contribution.find({
        user_id: user.id,
        status: 'approved'
      });
      const totalPoints = contributions.reduce((sum, contribution) => {
        return sum + contribution.points;
      }, 0);
      await User.findOneAndUpdate(
        { id: user.id },
        { totalPoints: totalPoints }
      );

      console.log(`Updated user ${user.id} with total points: ${totalPoints}`);
    }

    console.log('Successfully updated all users\' total points');
    process.exit(0);
  } catch (error) {
    console.error('Error updating user total points:', error);
    process.exit(1);
  }
}

updateTotalPoints();