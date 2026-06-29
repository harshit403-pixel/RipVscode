// importing modules
import logger from "../config/logger.config.js";

// funciton to throw all the errors in a single place
function errorMiddleware(err, req, res, next) {

    // logging the error stack
    logger.error(err.stack);

    console.error(err);

    // sending the error response
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        details: err.details || null
    }); 
}

export default errorMiddleware;