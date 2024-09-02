import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getUserById } from './userUtils.mjs';

dotenv.config();

async function getSecret(user) {
    const details = await getUserById(user.user_id);
    return details.password_hash;
}

export async function generateToken(user) {
    const JWT_SECRET = await getSecret(user);
    return jwt.sign(user, JWT_SECRET, { expiresIn: '6h' });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null; 
    }
}
