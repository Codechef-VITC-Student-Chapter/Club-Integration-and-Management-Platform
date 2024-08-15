import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userSchema from '../DB/schemas/userSchema.mjs';

dotenv.config();

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;

const connectionString = `mongodb+srv://${username}:${password}@ciandmp.duflp.mongodb.net/?retryWrites=true&w=majority&appName=CIandMP`;

mongoose.connect(connectionString)
    .then(() => { console.log('Connected to MongoDB'); })
    .catch((err) => { console.log(err); });

const User = mongoose.models.User || mongoose.model('AppData', userSchema); 

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
