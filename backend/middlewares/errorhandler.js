const {ValidationError} = require('joi');

const ErrorHandler = (error, req , res,next) => {
    let status = 500;
    let data = {
        message : 'Internal Server Error or Check conditions in code nigga'
    }

    if(error instanceof ValidationError){
        status = 401;
        data.message = error.message;

        return res.status(status).json(data);
    }

    if(error.status){
        status = error.status;
    }

    if(error.message){
        data.message = error.message;
    }

    return res.status(status).json(data);
}

module.exports = ErrorHandler;