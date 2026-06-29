import NotFound from "../errors/notfound.error.js";
import ApiError from "../utils/ApiError.util.js";

// function to handle not found routes
function notFoundHandler(req, res, next) {
    throw new NotFound("Route not found");
}

export default notFoundHandler;