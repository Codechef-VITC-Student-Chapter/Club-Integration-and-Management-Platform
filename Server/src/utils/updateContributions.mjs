import mongoose from "mongoose";
import dotenv from "dotenv";
import contributionSchema, { Contribution } from "../DB/Schemas/contSchema.mjs";

dotenv.config({ path: ".../.env" });

const connectionString = process.env.CONNECTION_STRING;

if (!connectionString) {
  console.error("MongoDB connection string is missing! Check your .env file.");
  process.exit(1);
}

// const Contribution =
//   mongoose.models.Contribution ||
//   mongoose.model("Contribution", contributionSchema);

const updateContributions = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log("✅ Connected to MongoDB");

    const result = await Contribution.updateMany(
      {},
      { $set: { secTargets: [] } } // Only update secTargets
    );

    console.log(
      `✅ Successfully updated ${result.modifiedCount} contributions by adding secTargets.`
    );
  } catch (error) {
    console.error("❌ Error updating contributions:", error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    console.log("🔗 MongoDB connection closed.");
  }
};

updateContributions();
