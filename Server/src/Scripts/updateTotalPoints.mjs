import dotenv from "dotenv";
import { User } from "../DB/Schemas/userSchema.mjs";
import { Contribution } from "../DB/Schemas/contSchema.mjs";
import mongoose from "mongoose";

dotenv.config();

const connectionString = process.env.CONNECTION_STRING;
mongoose
  .connect(connectionString)
  .then(async () => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

async function updateTotalPoints() {
  try {
    console.log("Starting update of user total points...");

    const users = await User.find({});
    console.log(`Found ${users.length} users to update`);

    for (const user of users) {
      const contributions = await Contribution.find({
        user_id: user.id,
        status: "approved",
      });
      const totalPoints = contributions.reduce((sum, contribution) => {
        return sum + contribution.points;
      }, 0);
      await User.findOneAndUpdate(
        { id: user.id },
        { total_points: totalPoints }
      );

      console.log(`Updated user ${user.id} with total points: ${totalPoints}`);
    }

    console.log("Successfully updated all users' total points");
    process.exit(0);
  } catch (error) {
    console.error("Error updating user total points:", error);
    process.exit(1);
  }
}

updateTotalPoints();
