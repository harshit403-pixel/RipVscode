import { body } from "express-validator";

const createRoomValidator = [
  body("roomName")
    .trim()
    .notEmpty()
    .withMessage("Room name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage(
      "Room name must be between 3 and 50 characters"
    ),
];

const joinRoomValidator = [
  body("roomCode")
    .trim()
    .notEmpty()
    .withMessage("Room code is required"),

  body("displayName")
    .trim()
    .notEmpty()
    .withMessage(
      "Display name is required"
    )
    .isLength({
      min: 2,
      max: 20,
    })
    .withMessage(
      "Display name must be between 2 and 20 characters"
    ),
];

const leaveRoomValidator = [
  body("participantId")
    .notEmpty()
    .withMessage(
      "Participant id is required"
    ),
];

export {
     createRoomValidator,
  joinRoomValidator,  
  leaveRoomValidator
 
};