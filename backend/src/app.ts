import express  from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

import authRoutes from "./modules/auth/auth.routes";   

app.use("/api/auth", authRoutes);

export default app
