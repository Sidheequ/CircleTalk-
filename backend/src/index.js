import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";

dotenv.config();
const PORT = process.env.PORT || 5001;

// Trust proxy is required for cookies to work on Render behind a load balancer
app.set("trust proxy", 1);

app.use(cors(
    {
        credentials: true,
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://192.168.1.71:5173",
            process.env.FRONTEND_URL
        ].filter(Boolean)
    }
));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    connectDB();
}); 