import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://192.168.1.71:5173",
            process.env.FRONTEND_URL
        ].filter(Boolean),
        credentials: true,
    },
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId] ? Array.from(userSocketMap[userId]) : [];
}

// used to store online users
const userSocketMap = {}; // {userId: Set[socketId1, socketId2, ...]}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (!userId || userId === "undefined") return;

    console.log("A user connected", userId, socket.id);

    if (!userSocketMap[userId]) {
        userSocketMap[userId] = new Set();
    }
    userSocketMap[userId].add(socket.id);

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", userId, socket.id);
        if (userSocketMap[userId]) {
            userSocketMap[userId].delete(socket.id);
            if (userSocketMap[userId].size === 0) {
                delete userSocketMap[userId];
            }
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };
