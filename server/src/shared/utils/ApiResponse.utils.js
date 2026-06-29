// funciton to send responses in a standard format
function ApiResponse(res, statusCode, message, data = null) {

    // sending the response
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}

export default ApiResponse;