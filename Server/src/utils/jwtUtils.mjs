import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;


export const generateToken = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, SECRET_KEY, { expiresIn: '6h' }, (err, token) => {
            if (err) reject(err);
            else resolve(token);
        });
    });
};

export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
        });
    });
};
