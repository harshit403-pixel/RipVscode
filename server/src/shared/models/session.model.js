import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
      index: true,
    },

    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      default: () =>
        new Date(
          Date.now() +
            7 * 24 * 60 * 60 * 1000
        ),
      index: {
        expires: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model(
  "sessions",
  sessionSchema
);

export default Session;