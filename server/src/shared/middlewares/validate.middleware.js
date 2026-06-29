// Importing modules
import pkg from 'express-validator';
const { validationResult } = pkg;
import BadRequest from '../errors/badrequest.error.js';

// middleware to handle the validation errors
function validateErrors(req, res, next) {

    // getting the validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        
        //if errors send only err number 1
        throw new BadRequest(errors.array()[0].msg);
    }
    
    next();
}

export default validateErrors;