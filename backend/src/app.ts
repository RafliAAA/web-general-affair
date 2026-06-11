import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes";
import assetsRoutes from "./modules/assets/assets.routes";
import borrowRoutes from "./modules/borrow/borrow.routes";
import returnRoutes from "./modules/return/return.routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetsRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/return", returnRoutes);

export default app;
