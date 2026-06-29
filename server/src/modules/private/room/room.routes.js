import express from "express";

import RoomController from "./room.controller.js";

import authMiddleware from "../../../shared/middlewares/auth.middleware.js";
import validateErrors from "../../../shared/middlewares/validate.middleware.js";
import asyncHandler from "../../../shared/utils/asynchandler.util.js";

import {
  createRoomValidator,
  joinRoomValidator,
  leaveRoomValidator,
} from "./room.validator.js";

const router =
  express.Router();

const roomController =
  new RoomController();

router.post(
  "/",
  authMiddleware,
  createRoomValidator,
  validateErrors,
  asyncHandler(
    roomController.createRoomController
  )
);

router.post(
  "/join",
  joinRoomValidator,
  validateErrors,
  asyncHandler(
    roomController.joinRoomController
  )
);

router.get(
  "/:roomCode",
  asyncHandler(
    roomController.getRoomController
  )
);


router.post(
  "/leave",
  leaveRoomValidator,
  validateErrors,
  asyncHandler(
    roomController.leaveRoomController
  )
);

router.delete(
  "/:roomCode",
  authMiddleware,
  asyncHandler(
    roomController.closeRoomController
  )
);

router.get(
  "/:roomCode/participants",
  asyncHandler(
    roomController.getParticipantsController
  )
);
export default router;