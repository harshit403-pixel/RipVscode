// Importing moduels 
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import env from '../config/env.config.js';

// Function to apply security middlewares
function applyMainMiddlewares(app) {

    // Helmet for setting various HTTP headers for security
    app.use(helmet());

    // Compression for compressing response bodies
    app.use(compression());

    // CORS for enabling Cross-Origin Resource Sharing
    app.use(cors({
        origin: env.FRONTEND_URL.split(",").map(url => url.trim()), // Allow multiple origins
        credentials: true
    }));

    // Cookie Parser for parsing cookies
    app.use(cookieParser());

    // HPP for preventing HTTP Parameter Pollution attacks
    app.use(hpp());

    // Rate Limiting to limit repeated requests to public APIs and/or endpoints
    if (env.NODE_ENV === 'production') {
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: env.API_LIMIT,
            message: 'Too many requests from this IP, please try again after 15 minutes'
        });
        app.use(limiter);
    }

    // Applying JSON body parser middleware
    app.use(express.json({ limit: '2mb' })); // limit body to 2mb

    // applying URL-encoded body parser middleware
    app.use(express.urlencoded({ extended: true, limit: '2mb' })); // limit body to 2mb

}

export default applyMainMiddlewares;