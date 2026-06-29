// Importing modules
import { decodeAccessToken } from '../utils/token.util.js';
import Unauthorized from '../errors/unauthorized.error.js';

// making the auth middleware to authenticate the user
function authMiddleware(req, res, next) {

    // checking if bearer token is present in the header or not
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Unauthorized("User Unauthenticated");
    }

    // getting the token from the header
    const token = authHeader.split(' ')[1];

    // verifying the token
    const decoded = decodeAccessToken(token);

    if (decoded == null) {
        throw new Unauthorized("User Unauthenticated");
    }

    // setting the user in the request object
    req.user = decoded;

    next();
}

export default authMiddleware;