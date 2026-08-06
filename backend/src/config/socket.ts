import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PATCH"],
      credentials: true,
    },
  });

  io.use((socket: Socket, next) => {
    console.log("🚀 Ada yang mencoba connect Socket.io..."); 
    const cookieHeader = socket.handshake.headers.cookie;

    if (cookieHeader) {
      console.log("✅ Cookie diterima di backend!");
      const cookies = cookie.parse(cookieHeader);

      const accessToken = cookies.accessToken;

      if (accessToken) {
        console.log("✅ Access Token ditemukan di cookie!");
        try {
          // Verifikasi pakai REFRESH_TOKEN_SECRET
          const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET as string,
          ) as any;

          socket.data.user_id = decoded.user_id;
          next();
        } catch (err) {
          console.error("❌ Socket Auth Error:", err); // Tambah ini untuk lihat error di terminal
          next(new Error("Authentication error (Token expired)"));
        }
      } else {
        next(new Error("Refresh token not found in cookie"));
      }
    } else {
      next(new Error("Cookie not provided"));
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log("✅ User connected:", socket.data.user_id);

    if (socket.data.user_id) {
      socket.join(socket.data.user_id);
    }

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.data.user_id);
    });
  });
};

export const sendNotificationToUser = (user_id: string, data: any) => {
  if (io) {
    io.to(user_id).emit("new_notification", data);
  }
};
