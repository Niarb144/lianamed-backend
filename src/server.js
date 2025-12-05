import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import adminRoutes from "./routes/admin.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import chatRoute from "./routes/chat.js";
import path from "path";
import { fileURLToPath } from "url";

import http from "http";
import { Server } from "socket.io";

dotenv.config();
connectDB();

const app = express();

// ---------------------------------------------------
// 📁 FILE PATH SETUP
// ---------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, "../uploads");

// ---------------------------------------------------
// 🔒 SECURITY & CORE MIDDLEWARE
// ---------------------------------------------------
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: [
      /\.ngrok-free\.app$/,
      "*",
      "http://localhost:5173",
      "http://192.168.0.152:5173",
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// ---------------------------------------------------
// 📂 STATIC FILE SERVING (Uploads)
// ---------------------------------------------------
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(uploadsPath, {
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);

// ---------------------------------------------------
// 🛣️ ROUTES
// ---------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoute);

app.get("/", (req, res) => res.send("Health API running"));

// ---------------------------------------------------
// ⚡ SOCKET.IO SERVER SETUP
// ---------------------------------------------------
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: [
      "*",
      "http://localhost:5173",
      "http://192.168.0.152:5173",
      /\.ngrok-free\.app$/,
    ],
    methods: ["GET", "POST"],
  },
});

// 🔥 Handle real-time connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query?.userId;
  if (userId) {
    socket.join(userId);
    console.log(`User ${userId} joined room: ${userId}`);
  }

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ---------------------------------------------------
// 🚀 START SERVER
// ---------------------------------------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running with Socket.io on http://localhost:${PORT}`)
);
