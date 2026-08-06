import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes"
import userRoutes from "./modules/user/user.routes";
import profileRoutes from "./modules/profile/profile.routes";
import entityRoutes from "./modules/entity/entity.routes"
import directorateRoutes from "./modules/directorate/directorate.routes"
import assetsRoutes from "./modules/assets/assets.routes";
import procurementRoutes from "./modules/procurement/procurement.routes";
import handoverRoutes from "./modules/handover/handover.routes";
import borrowRoutes from "./modules/borrow/borrow.routes";
import returnRoutes from "./modules/return/return.routes";
import maintenanceRoutes from "./modules/maintenance/maintenance.routes";
import disposalRoutes from "./modules/disposal/disposal.routes";
import roomRoutes from "./modules/rooms/rooms.routes"
import bookingRoutes from "./modules/bookings/bookings.routes"
import notificationRoutes from "./modules/notifications/notification.routes"

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
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/directorate", directorateRoutes)
app.use("/api/entity", entityRoutes)
app.use("/api/assets", assetsRoutes);
app.use("/api/procurement", procurementRoutes);
app.use("/api/handover", handoverRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/return", returnRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/disposal", disposalRoutes);
app.use("/api/rooms", roomRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/notifications", notificationRoutes)

export default app;
