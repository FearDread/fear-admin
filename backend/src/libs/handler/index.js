const AppError = require("./error.js");

exports.missing = ( req, res ) => {
    return res.status(StatusCodes.NOT_FOUND).send("Route does not exist");
};

exports.synca = ( fn ) => {
    return (req, res, next) => {
        const resp = fn( req, res, next );
        if ( resp instanceof Promise ) {
          return resp.catch( next );
        }
        return resp;
    };
;}

exports.err = ( type, code, msg ) => {
    return new AppError[type]( msg, code );
};