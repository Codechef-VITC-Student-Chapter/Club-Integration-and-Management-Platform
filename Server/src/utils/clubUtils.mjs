import mongoose from 'mongoose';
import dotenv from 'dotenv';
import clubSchema from '../DB/Schemas/clubSchema.mjs';

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

const Club = mongoose.models.Club || mongoose.model('Clubs', clubSchema);

export const addClub = async (clubData) => {
  try {
    const newClub = new Club(clubData);
    await newClub.save();
    return newClub;
  } catch (error) {
    console.log(error);
    console.log(clubData);
    throw new Error('Failed to add club');
  }
};

export const removeClub = async (clubId) => {
  try {
    const deletedClub = await Club.findOneAndDelete({ clubId: clubId });
    if (!deletedClub) {
      throw new Error('Club not found');
    }
    return deletedClub;
  } catch (error) {
    throw new Error('Failed to remove club');
  }
};

export const getClubById = async (clubId) => {
  try {
    const club = await Club.findOne({ clubId: clubId });
    if (!club) {
      throw new Error('Club not found');
    }
    return club;
  } catch (error) {
    throw new Error('Failed to fetch club');
  }
};

export const addDepartmentToClub = async (clubId, departmentId) => {
  try {
    const club = await Club.findOne({ clubId: clubId });
    if (!club) {
      throw new Error('Club not found');
    }
    if (!club.clubDeps.includes(departmentId)) {
      club.clubDeps.push(departmentId);
      await club.save();
    }
    return club;
  } catch (error) {
    throw new Error('Failed to add department to club');
  }
};

export const removeDepartmentFromClub = async (clubId, departmentId) => {
  try {
    const club = await Club.findOne({ clubId: clubId });
    if (!club) {
      throw new Error('Club not found');
    }
    club.clubDeps = club.clubDeps.filter(
      (dep) => dep.toString() !== departmentId
    );
    await club.save();
    return club;
  } catch (error) {
    throw new Error('Failed to remove department from club');
  }
};

export const addUserToClub = async (clubId, userId) => {
  try {
    const club = await Club.findOne({ clubId: clubId });
    if (!club) {
      throw new Error('Club not found');
    }
    if (!club.clubLeads.includes(userId)) {
      club.clubLeads.push(userId);
      await club.save();
    }
    return club;
  } catch (error) {
    throw new Error('Failed to add user to club');
  }
};

export const removeUserFromClub = async (clubId, userId) => {
  try {
    const club = await Club.findOne({ clubId: clubId });
    if (!club) {
      throw new Error('Club not found');
    }
    club.clubLeads = club.clubLeads.filter(
      (user) => user.toString() !== userId
    );
    await club.save();
    return club;
  } catch (error) {
    throw new Error('Failed to remove user from club');
  }
};
