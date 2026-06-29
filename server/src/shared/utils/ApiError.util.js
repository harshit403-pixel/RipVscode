// extending the default error class to create a custom API error class
class ApiError extends Error {
    constructor(statusCode, message, details = null) {

        // calling the parent constructor
        super(message);

        // setting the status code and message
        this.statusCode = statusCode;
        this.message = message;
        this.details = details;
    }
}

export default ApiError;