import ApiError from "../utils/ApiError.util.js";

class Unauthorized extends ApiError {
    constructor(message, details = null) {

        // calling the parent constructor with status code 401
        super(401, message, details);

    } 
}

export default Unauthorized;