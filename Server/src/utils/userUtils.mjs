import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userSchema from '../DB/schemas/userSchema.mjs';

dotenv.config();

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;

const connectionString = `mongodb+srv://${username}:${password}@ciandmp.duflp.mongodb.net/AppData?retryWrites=true&w=majority&appName=CIandMP`;

mongoose.connect(connectionString)
    .then(() => { console.log('Connected to MongoDB'); })
    .catch((err) => { console.log(err); });

const User = mongoose.models.User || mongoose.model('Users', userSchema);

export const addUser = async (userData) => {
    try {
        const newUser = new User(userData);
        await newUser.save();
        return newUser;
    } catch (error) {
        throw new Error('Failed to add user');
    }
};

export const removeUser = async (userId) => {
    try {
        const deletedUser = await User.findOneAndDelete({ user_id: userId });
        if (!deletedUser) {
            throw new Error('User not found');
        }
        return deletedUser;
    } catch (error) {
        throw new Error('Failed to remove user');
    }
};

export const getUserById = async (userId) => {
    try {
        const user = await User.findOne({ user_id: userId });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        throw new Error('Failed to fetch user');
    }
};

export const addDepartments = async (userId, departments) => {
    try {
        const user = await User.findOne({ user_id: userId });
        if (!user) {
            throw new Error('User not found');
        }
        user.deps = [...new Set([...user.deps, ...departments])]; // Avoid duplicate entries
        await user.save();
        return user;
    } catch (error) {
        throw new Error('Failed to add departments');
    }
};

export const addClubs = async (userId, clubs) => {
    try {
        const user = await User.findOne({ user_id: userId });
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

export const removeDepartments = async (userId, departmentsToRemove) => {
    try {
        const user = await User.findOne({ user_id: userId });
        if (!user) {
            throw new Error('User not found');
        }
        user.deps = user.deps.filter(department => !departmentsToRemove.includes(department));
        await user.save();
        return user;
    } catch (error) {
        throw new Error('Failed to remove departments');
    }
};

export const removeClubs = async (userId, clubsToRemove) => {
    try {
        const user = await User.findOne({ user_id: userId });
        if (!user) {
            throw new Error('User not found');
        }
        user.clubs = user.clubs.filter(club => !clubsToRemove.includes(club));
        await user.save();
        return user;
    } catch (error) {
        throw new Error('Failed to remove clubs');
    }
};

// Functions to handle contributions

export const addContributions = async (userId, contributions) => {
    try {
        const user = await User.findOne({ user_id: userId });
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

export const removeContributions = async (userId, contributionsToRemove) => {
    try {
        const user = await User.findOne({ user_id: userId });
        if (!user) {
            throw new Error('User not found');
        }
        user.contributions = user.contributions.filter(contribution => !contributionsToRemove.includes(contribution));
        await user.save();
        return user;
    } catch (error) {
        throw new Error('Failed to remove contributions');
    }
};
