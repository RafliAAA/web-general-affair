import express  from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes";   

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

export default app
