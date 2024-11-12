import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userSchema from '../DB/Schemas/userSchema.mjs';

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

const User = mongoose.models.User || mongoose.model('User', userSchema);

export const addUser = async (userData) => {
  try {
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to add user');
  }
};

export const removeUser = async (ID) => {
  try {
    const deletedUser = await User.findOneAndDelete({ ID: ID });
    if (!deletedUser) {
      throw new Error('User not found');
    }
    return deletedUser;
  } catch (error) {
    throw new Error('Failed to remove user');
  }
};

export const getUserById = async (ID) => {
  try {
    const user = await User.findOne({ ID: ID });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
};

export const getUserByReg = async (registrationNumber) => {
  try {
    const user = await User.findOne({ registrationNumber: registrationNumber });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
};

export const addDepartments = async (ID, departments) => {
  try {
    const user = await User.findOne({ ID: ID });
    if (!user) {
      throw new Error('User not found');
    }
    user.departments = [...new Set([...user.departments, ...departments])]; // Avoid duplicate entries
    await user.save();
    return user;
  } catch (error) {
    throw new Error('Failed to add departments');
  }
};

export const addClubs = async (ID, clubs) => {
  try {
    const user = await User.findOne({ ID: ID });
    if (!user) {
      throw new Error('User not found');
    }
    user.clubs = [...new Set([...user.clubs, ...clubs])]; // Avoid duplicate entries
    await user.save();
    return user;
  } catch (error) {
    throw new Error('Failed to add clubs');
  }
};

export const removeDepartments = async (ID, departmentsToRemove) => {
  try {
    const user = await User.findOne({ ID: ID });
    if (!user) {
      throw new Error('User not found');
    }
    user.departments = user.departments.filter(
      (department) => !departmentsToRemove.includes(department)
    );
    await user.save();
    return user;
  } catch (error) {
    throw new Error('Failed to remove departments');
  }
};

export const removeClubs = async (ID, clubsToRemove) => {
  try {
    const user = await User.findOne({ ID: ID });
    if (!user) {
      throw new Error('User not found');
    }
    user.clubs = user.clubs.filter((club) => !clubsToRemove.includes(club));
    await user.save();
    return user;
  } catch (error) {
    throw new Error('Failed to remove clubs');
  }
};

export const addContributions = async (ID, contributions) => {
  try {
    const user = await User.findOne({ ID: ID });
    if (!user) {
      throw new Error('User not found');
    }
    user.contributions = [...new Set([...user.contributions, ...contributions])]; // Avoid duplicate entries
    await user.save();
    return user;
  } catch (error) {
    throw new Error('Failed to add contributions');
  }
};

export const updateLead = async (ID, leadType) => {
  try {
    const user = await User.findOne({ ID: ID });
    if (!user) {
      throw new Error('User not found');
    }
    user.isLead = leadType;
    await user.save();
    return user;
  } catch (error) {
    throw new Error('Failed to update lead');
  }
};

export const removeContributions = async (ID, contributionsToRemove) => {
  try {
    const user = await User.findOne({ ID: ID });
    if (!user) {
      throw new Error('User not found');
    }
    user.contributions = user.contributions.filter(
      (contribution) => !contributionsToRemove.includes(contribution)
    );
    await user.save();
    return user;
  } catch (error) {
    throw new Error('Failed to remove contributions');
  }
};