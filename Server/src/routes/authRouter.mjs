import express from 'express';
import crypto from 'crypto';

import { generateToken } from '../utils/jwtUtils.mjs';
import { addUser, getUserByReg } from '../utils/userUtils.mjs';
const authRouter = express.Router();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

authRouter.post('/signup', async (req, res) => {
  const { regno, firstname, lastname, email, password } = req.body;
  const user_id = 'UID' + regno;

  try {
    const newUser = {
      user_id,
      reg_no: regno,
      first_name: firstname,
      last_name: lastname,
      email: email,
      password_hash: hashPassword(password),
    };

    await addUser(newUser);

    const token = await generateToken({ id: user.user_id, name: user.first_name + ' ' +user.last_name, isLead: user.isLead });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

authRouter.post('/login', async (req, res) => {
  const { regno, password } = req.body;

  try {
    const user = await getUserByReg(regno);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const isMatch = hashPassword(password) === user.password_hash;

    if (!isMatch) {
      return res.status(401).send('Invalid credentials');
    }

    const token = await generateToken({ id: user.user_id, name: user.first_name + ' ' +user.last_name, isLead: user.isLead });
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

export default authRouter;
