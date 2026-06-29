// Importing modules
import mongoose from "mongoose";

// Defining the participant schema
const participantSchema =
  new mongoose.Schema(
    {
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rooms",
        required: true,
        index: true,
      },

      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
      },

      displayName: {
        type: String,
        required: true,
        trim: true,
      },

      role: {
        type: String,
        enum: ["HOST", "GUEST"],
        default: "GUEST",
      },

      socketId: {
        type: String,
        default: null,
      },

      isOnline: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

// Creating the model
const Participant =
  mongoose.model(
    "participants",
    participantSchema
  );

// Exporting the model
export default Participant;