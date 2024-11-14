import express from 'express';
import crypto from 'crypto';

import { generateToken } from '../utils/jwtUtils.mjs';
import { addUser, getUserByReg } from '../utils/userUtils.mjs';

const authRouter = express.Router();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

authRouter.post('/signup', async (req, res) => {
  const { registrationNumber, firstName, lastName, email, password } = req.body;
  const ID = 'UID' + registrationNumber;

  try {
    const newUser = {
      ID,
      registrationNumber,
      firstName,
      lastName,
      email,
      passwordHash: hashPassword(password),
    };

    await addUser(newUser);

    const token = await generateToken({
      id: newUser.ID,
      name: newUser.firstName + ' ' + newUser.lastName,
      isLead: newUser.isLead,
    });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

authRouter.post('/login', async (req, res) => {
  const { registrationNumber, password } = req.body;
  console.log(req.body);
  try {
    const user = await getUserByReg(registrationNumber);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const isMatch = hashPassword(password) === user.passwordHash;

    if (!isMatch) {
      return res.status(401).send('Invalid credentials');
    }

    const token = await generateToken({
      id: user.ID,
      name: user.firstName + ' ' + user.lastName,
      isLead: user.isLead,
    });
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

export default authRouter;
