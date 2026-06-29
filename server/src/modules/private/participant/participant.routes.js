import express from "express";
import asyncHandler from "../../../shared/utils/asynchandler.util.js";
import ParticipantController from "./participant.controller.js";

const router =
  express.Router();

const participantController =
  new ParticipantController();

router.patch(
  "/:participantId",
  asyncHandler(
    participantController.updateParticipantController
  )
);

export default router;