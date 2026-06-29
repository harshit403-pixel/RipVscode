import ApiError from "../utils/ApiError.util.js";

class NotFound extends ApiError {
    constructor(message, details = null) {

        // calling the parent constructor with status code 404
        super(404, message, details);

    } 
}

export default NotFound;