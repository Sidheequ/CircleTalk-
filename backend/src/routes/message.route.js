
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar, getMessages, sendMessage, getConversations, blockUser, clearMessages, deleteChat } from "../controllers/message.controller.js";

const router = express.Router();

router.get('/users', protectRoute, getUsersForSidebar);
router.get('/conversations', protectRoute, getConversations);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);
router.post("/block/:id", protectRoute, blockUser);
router.delete("/clear/:id", protectRoute, clearMessages);
router.delete("/delete/:id", protectRoute, deleteChat);


export default router;