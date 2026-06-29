// Importing modules
import mongoose from 'mongoose';

// making the schema for the token
const tokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        token: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["otp", "reset"],
            required: true
        },
        expiresAt: {
            type: Date,
            required: true,
            index: {
                expires: 0
            }
        },
        tries: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

// making the model from the schema
const Token = mongoose.model('tokens', tokenSchema);

export default Token;