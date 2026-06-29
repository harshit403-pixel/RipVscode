import ApiError from "../utils/ApiError.util.js";

class BadRequest extends ApiError {
    constructor(message, details = null) {

        // calling the parent constructor with status code 400
        super(400, message, details);

    } 
}

export default BadRequest;