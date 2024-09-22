import { decode } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwtUtils.mjs';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).send('Access Denied');

  try {
    const decoded = await verifyToken(token);
    req.user = decoded.id;
    req.isLead = decoded.isLead;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid Token' });
  }
};
