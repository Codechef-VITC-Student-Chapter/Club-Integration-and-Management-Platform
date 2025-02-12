import { decode } from "jsonwebtoken";
import { verifyToken } from "../utils/jwtUtils.mjs";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Access Denied");

  try {
    const decoded = await verifyToken(token);
    req.user = decoded.id;
    req.is_lead = decoded.is_lead;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid Token" });
  }
};
