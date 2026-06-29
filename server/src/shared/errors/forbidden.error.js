import ApiError from "../utils/ApiError.util.js";

class Forbidden extends ApiError {
    constructor(message, details = null) {

        // calling the parent constructor with status code 403
        super(403, message, details);

    } 
}

export default Forbidden;