import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// get users for sidebar controller (all users for contacts discovery)
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// get conversations controller (only users with message history)
export const getConversations = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Find unique users that have sent or received messages from/to the current user
        const messages = await Message.find({
            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }]
        }).sort({ createdAt: -1 });

        const userIds = new Set();
        messages.forEach(msg => {
            if (msg.senderId.toString() !== loggedInUserId.toString()) userIds.add(msg.senderId.toString());
            if (msg.receiverId.toString() !== loggedInUserId.toString()) userIds.add(msg.receiverId.toString());
        });

        const users = await User.find({ _id: { $in: Array.from(userIds) } }).select("-password");

        // Sort users based on the order they appear in (latest message first)
        const sortedUsers = Array.from(userIds).map(id => users.find(u => u._id.toString() === id)).filter(Boolean);

        res.status(200).json(sortedUsers);
    } catch (error) {
        console.log("Error in getConversations: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// get messages controller
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId },
            ],
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// send message controller
export const sendMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;
        const { text, image, video } = req.body;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        let videoUrl;
        if (video) {
            const uploadResponse = await cloudinary.uploader.upload(video);
            videoUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId: userToChatId,
            text,
            image: imageUrl,
            video: videoUrl,
        });

        // realtime functionality goes here => Socket.io
        const receiverSocketIds = getReceiverSocketId(userToChatId);
        if (receiverSocketIds.length > 0) {
            receiverSocketIds.forEach(socketId => {
                io.to(socketId).emit("newMessage", newMessage);
            });
        }

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
