import ApiError from "../utils/ApiError.util.js";

class Conflict extends ApiError {
    constructor(message, details = null) {

        // calling the parent constructor with status code 409
        super(409, message, details);

    } 
}

export default Conflict;