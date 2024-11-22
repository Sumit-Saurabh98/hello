import express from 'express';
import { login, logout, signup, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup as express.RequestHandler)

router.post('/login', login as express.RequestHandler)

router.post('/logout', logout as express.RequestHandler)

router.put('/update-profile', protectRoute, updateProfile as express.RequestHandler)

router.get('/check', protectRoute, checkAuth as express.RequestHandler)

export default router;