// Importing the modules
import Forbidden from "../errors/forbbidon.error.js";

// function to authorize the middleware
function authorize(...roles) {

    return (req, res, next) => {

        // if the user is there in the roles then go ahead
        if (roles.includes(req.user.role)) {
            return next();
        }

        throw new Forbidden("Cannot access this resource");

    }
}

export default authorize;