
const models = require("../models");
const jwt = require("jsonwebtoken");



exports.isAuthorized = async ( req, res, next ) => {
  const authHeader = req.headers.authorization;
  const authCookie = req.cookies;

  if ( !authHeader || !authCookie ) {
    return next( this.authError(401) )
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await models.users.findById(deCodeToken.id);

    req.user = user;
    next();
  
    } catch (error) {
      this.authError( 401 );
    }
};

exports.authorizeRoles = (...roles) => {
 
  return (req , res , next) => {
    if ( roles.includes( req.user.role ) === false) { 
        return next( this.authError ( 403 ))
    }
   
    next();
 }
};

exports.authError = ( req, res, code ) => {
  
  return res.status( code )
    .json({
      status: 'fail',
      message: 'Unauthorized!',
    });
};