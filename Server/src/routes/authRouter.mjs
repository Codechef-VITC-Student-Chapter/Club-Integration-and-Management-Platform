import express from "express";
import crypto from "crypto";
import CryptoJs from "crypto-js";
import { generateToken } from "../utils/jwtUtils.mjs";
import { addUser, getUserByReg } from "../utils/userUtils.mjs";

const authRouter = express.Router();

// function hashPassword(password) {
//   return crypto.createHash("sha256").update(password).digest("hex");
// }
const { SHA256 } = CryptoJs;
function hashPassword(password) {
  return SHA256(password).toString();
}
authRouter.post("/signup", async (req, res) => {
  const { reg_number, first_name, last_name, email, password } = req.body;
  const user_id = "UID" + reg_number;
  try {
    const newUser = {
      id: user_id,
      reg_number,
      first_name,
      last_name,
      email,
      password: hashPassword(password),
    };
    await addUser(newUser);
    const token = await generateToken({
      id: newUser.user_id,
      name: newUser.first_name + " " + newUser.last_name,
      is_lead: newUser.is_lead,
    });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

authRouter.post("/login", async (req, res) => {
  const { reg_number, password } = req.body;

  try {
    const user = await getUserByReg(reg_number);

    if (!user) {
      return res.status(404).send("User not found");
    }
    const isMatch = hashPassword(password) === user.password;

    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    const token = await generateToken({
      id: user.id,
      name: user.first_name + " " + user.last_name,
      is_lead: user.is_lead,
    });
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

export default authRouter;
