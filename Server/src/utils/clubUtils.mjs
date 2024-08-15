import mongoose from 'mongoose';
import dotenv from 'dotenv';
import clubSchema from '../DB/schemas/clubSchema.mjs';

dotenv.config();

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;

const connectionString = `mongodb+srv://${username}:${password}@ciandmp.duflp.mongodb.net/AppData?retryWrites=true&w=majority&appName=CIandMP`;

mongoose.connect(connectionString)
    .then(() => { console.log('Connected to MongoDB'); })
    .catch((err) => { console.log(err); });

const Club = mongoose.models.Club || mongoose.model('Clubs', clubSchema);

export const addClub = async (clubData) => {
    try {
        const newClub = new Club(clubData);
        await newClub.save();
        return newClub;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to add club');
    }
};

export const removeClub = async (clubId) => {
    try {
        const deletedClub = await Club.findOneAndDelete({ club_id: clubId });
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
        const club = await Club.findOne({ club_id: clubId });
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
        const club = await Club.findOne({ club_id: clubId });
        if (!club) {
            throw new Error('Club not found');
        }
        if (!club.club_deps.includes(departmentId)) {
            club.club_deps.push(departmentId);
            await club.save();
        }
        return club;
    } catch (error) {
        throw new Error('Failed to add department to club');
    }
};

export const removeDepartmentFromClub = async (clubId, departmentId) => {
    try {
        const club = await Club.findOne({ club_id: clubId });
        if (!club) {
            throw new Error('Club not found');
        }
        club.club_deps = club.club_deps.filter(dep => dep.toString() !== departmentId);
        await club.save();
        return club;
    } catch (error) {
        throw new Error('Failed to remove department from club');
    }
};

export const addUserToClub = async (clubId, userId) => {
    try {
        const club = await Club.findOne({ club_id: clubId });
        if (!club) {
            throw new Error('Club not found');
        }
        if (!club.club_leads.includes(userId)) {
            club.club_leads.push(userId);
            await club.save();
        }
        return club;
    } catch (error) {
        throw new Error('Failed to add user to club');
    }
};

export const removeUserFromClub = async (clubId, userId) => {
    try {
        const club = await Club.findOne({ club_id: clubId });
        if (!club) {
            throw new Error('Club not found');
        }
        club.club_leads = club.club_leads.filter(user => user.toString() !== userId);
        await club.save();
        return club;
    } catch (error) {
        throw new Error('Failed to remove user from club');
    }
};
