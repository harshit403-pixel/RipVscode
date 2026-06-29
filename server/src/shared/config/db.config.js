// importing modules 
import mongoose from 'mongoose';
import env from './env.config.js';
import logger from "./logger.config.js";
import dns from "dns";

if (env.NODE_ENV !== "production") {
    // Changing the dns settings
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

// function to connect to the database
async function connectDB() {
    try {

        // connecting to the database
        await mongoose.connect(env.MONGO_URI);
        logger.info('Connected to MongoDB');
        return mongoose.connection;

    } catch (error) {
        logger.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

export default connectDB;