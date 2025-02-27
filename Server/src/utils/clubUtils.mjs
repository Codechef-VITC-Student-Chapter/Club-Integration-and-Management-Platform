import dotenv from "dotenv";
import { Club } from "../DB/Schemas/clubSchema.mjs";
import { User } from "../DB/Schemas/userSchema.mjs";

dotenv.config();

// const connectionString = process.env.CONNECTION_STRING;
// mongoose
//   .connect(connectionString)
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// const Club = mongoose.models.Club || mongoose.model("Club", clubSchema);

export const getAllMembersFromClub = async (clubId) => {
  try {
    const users = await User.find({ clubs: { $in: [clubId] } });
    // console.log(users);
    return users.map((user) => ({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      reg_number: user.reg_number,
      total_points: user.total_points,
      last_update: user.last_update,
    }));
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch user");
  }
};

export const addClub = async (clubData) => {
  try {
    const newClub = new Club(clubData);
    await newClub.save();
    return newClub;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to add club");
  }
};

export const removeClub = async (clubId) => {
  try {
    const deletedClub = await Club.findOneAndDelete({ ID: clubId });
    if (!deletedClub) {
      throw new Error("Club not found");
    }
    return deletedClub;
  } catch (error) {
    throw new Error("Failed to remove club");
  }
};

export const getClubById = async (clubId) => {
  try {
    const club = await Club.findOne({ id: clubId });
    if (!club) {
      throw new Error("Club not found");
    }
    return club;
  } catch (error) {
    throw new Error("Failed to fetch club");
  }
};

export const addDepartmentToClub = async (clubId, departmentId) => {
  try {
    const club = await Club.findOne({ ID: clubId });
    if (!club) {
      throw new Error("Club not found");
    }
    if (!club.departments.includes(departmentId)) {
      club.departments.push(departmentId);
      await club.save();
    }
    return club;
  } catch (error) {
    throw new Error("Failed to add department to club");
  }
};

export const removeDepartmentFromClub = async (clubId, departmentId) => {
  try {
    const club = await Club.findOne({ ID: clubId });
    if (!club) {
      throw new Error("Club not found");
    }
    club.departments = club.departments.filter((dep) => dep !== departmentId);
    await club.save();
    return club;
  } catch (error) {
    throw new Error("Failed to remove department from club");
  }
};

export const addUserToClub = async (clubId, userId) => {
  try {
    const club = await Club.findOne({ ID: clubId });
    if (!club) {
      throw new Error("Club not found");
    }
    if (!club.clubLeads.includes(userId)) {
      club.clubLeads.push(userId);
      await club.save();
    }
    return club;
  } catch (error) {
    throw new Error("Failed to add user to club");
  }
};

export const removeUserFromClub = async (clubId, userId) => {
  try {
    const club = await Club.findOne({ ID: clubId });
    if (!club) {
      throw new Error("Club not found");
    }
    club.clubLeads = club.clubLeads.filter((user) => user !== userId);
    await club.save();
    return club;
  } catch (error) {
    throw new Error("Failed to remove user from club");
  }
};
