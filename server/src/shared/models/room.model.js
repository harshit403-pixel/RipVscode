// Importing modules
import mongoose from "mongoose";

// Defining the room schema
const roomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true,
      trim: true,
    },

    roomCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },

    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },

    document: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Creating the model
const Room = mongoose.model(
  "rooms",
  roomSchema
);

// Exporting the model
export default Room;