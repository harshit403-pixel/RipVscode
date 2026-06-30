// Importing modules 
import express from 'express';
import authRoutes from "../../modules/public/auth/auth.router.js";
import roomRoutes from "../../modules/private/room/room.routes.js";
import participantRoutes from "../../modules/private/participant/participant.routes.js";

// making the router 
const router = express.Router();

// Adding the nested routes 
router.use("/auth", authRoutes);
router.use("/rooms", roomRoutes);
router.use("/participants", participantRoutes);

export default router;