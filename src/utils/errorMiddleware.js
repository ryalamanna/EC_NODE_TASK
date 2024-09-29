import ApiError from "./apiError.js";

const errorHandler = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        error = new ApiError(500, err.message || 'Something went wrong');
    }

    const response = {
        statusCode: error.statusCode,
        message: error.message
    };

    return res.status(error.statusCode).json(response);
};

export default errorHandler;
