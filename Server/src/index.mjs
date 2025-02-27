import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

import userRouter from "./routes/usersRouter.mjs";
import clubRouter from "./routes/clubRouter.mjs";
import authRouter from "./routes/authRouter.mjs";
import depsRouter from "./routes/depsRouter.mjs";
import contRouter from "./routes/contRouter.mjs";
import mongoose from "mongoose";
import forgetPassRouter from "./routes/forgetPassRouter.mjs";
dotenv.config();
const app = express();
const connectionString = process.env.CONNECTION_STRING;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/CIMP";

mongoose
  .connect(connectionString)
  .then(async () => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/userApi", userRouter);
app.use("/clubApi", clubRouter);
app.use("/authApi", authRouter);
app.use("/depsApi", depsRouter);
app.use("/contApi", contRouter);
app.use("/forgetPassword", forgetPassRouter);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/apimap", (_req, res) => {
  res.sendFile(join(__dirname, "sitemap.html"));
});
app.listen(3000, async () => {
  console.log(`Server is running on port ${3000}`);
});

export default app;
