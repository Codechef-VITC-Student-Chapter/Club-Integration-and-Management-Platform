import mongoose from "mongoose";
// import userSchema from "../DB/Schemas/userSchema.mjs";
import dotenv from "dotenv";
import { Contribution } from "../DB/Schemas/contSchema.mjs";
import { User } from "../DB/Schemas/userSchema.mjs";
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

async function addTotalPoints() {
  const users = await User.updateMany({}, { $set: { total_points: 0 } });
  console.log(users.modifiedCount);
}
// addTotalPoints();

async function addReason() {
  const conts = await Contribution.updateMany({}, { $set: { reason: "" } });
  console.log(conts.modifiedCount);
}
// addReason();

async function addSecTargets() {
  const conts = await Contribution.updateMany({}, { $set: { secTargets: [] } });
  console.log(conts.modifiedCount);
}
// addSecTargets();

async function addClubToUser() {
  const conts = await User.updateMany(
    {},
    { $set: { clubs: ["codechefvitc"] } }
  );
  console.log(conts.modifiedCount);
}
// addClubToUser();

async function addLastUpdate() {
  const users = await User.updateMany(
    {},
    { $set: { last_update: Date.now() } }
  );
  console.log(users.modifiedCount);
}
// addLastUpdate();
