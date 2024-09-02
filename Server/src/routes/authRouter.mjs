import express from 'express';
import { generateToken } from '../utils/jwtUtils.mjs';
import { getUserByReg } from '../utils/userUtils.mjs';

const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
    const { regno, password } = req.body;

    try {
        const user = await getUserByReg(regno);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const isMatch = password === user.password_hash;

        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }

        const token = await generateToken({ user_id: user.user_id });

        res.json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

export default authRouter;
