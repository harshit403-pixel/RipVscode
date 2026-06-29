// Importing moduels 
import pino from 'pino';
import env from './env.config.js';

// Creating a pino logger instance with configuration
const logger = pino({
    level: env.LOG_LEVEL,
    transport: {
        target: 'pino-pretty',
    }
});

// Exporting the logger instance for use in other parts of the application
export default logger;