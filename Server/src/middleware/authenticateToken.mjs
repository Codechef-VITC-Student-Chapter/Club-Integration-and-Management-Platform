import { decode } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwtUtils.mjs';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // Check if token is provided
  if (!token) {
    return res.status(401).json({ error: 'Access Denied: No token provided' });
  }

  try {
    const decoded = await verifyToken(token);

    // Ensure that decoded information is valid
    if (!decoded || !decoded.id) {
      return res.status(403).json({ error: 'Invalid Token: Decoding failed' });
    }

    req.user = decoded.id; // Store user ID in request
    req.isLead = decoded.isLead; // Store user role in request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(403).json({ error: 'Invalid Token' });
  }
};
