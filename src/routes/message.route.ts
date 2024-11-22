import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getUsersForSidebar, getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get('/users', protectRoute, getUsersForSidebar as express.RequestHandler)
router.get('/:id', protectRoute, getMessages as express.RequestHandler)
router.post('/send/:id', protectRoute, sendMessage as express.RequestHandler)

export default router;