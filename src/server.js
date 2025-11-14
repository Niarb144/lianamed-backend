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
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const app = express();

// -------------------------------
// ✅ CONFIG
// -------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, "../uploads");

// ✅ Secure middleware
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// ✅ Configure CORS properly
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.0.152:5173", // local network React app
    ],
    credentials: true,
  })
);

// -------------------------------
// ✅ STATIC FILE SERVING (Fix for images)
// -------------------------------
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

// -------------------------------
// ✅ ROUTES
// -------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => res.send("Health API running"));

// -------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
