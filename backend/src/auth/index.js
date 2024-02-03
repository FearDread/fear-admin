
const models = require("../models");
const jwt = require("jsonwebtoken");
const error = require("../middleware");



exports.isAuthenticatedUser = async ( req, res, next ) => {
  const authHeader = req.headers.authorization;
  const authCookie = req.cookies;

  if ( !authHeader || !authCookie ) {
    return next( error(401, "Unauthorized") )
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await models.users.findById(deCodeToken.id);

    req.user = user;
    next();
  
    } catch (err) {
      console.log(err).json();
      error(401, "No Admin User Found");
    }
};

exports.authorizeRoles = (...roles) => {
 
  return (req , res , next) => {
    if ( roles.includes( req.user.role ) === false) { 
        return next( error(401, "Unauthorized") );
    }
   
    next();
 }
};
