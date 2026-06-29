// function to handle the async tasks and catch the errors 
function asyncHandler(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

export default asyncHandler;