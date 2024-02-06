

exports.isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    
    if (authorization) {
      const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
      
      jwt.verify(
        token,
        process.env.JWT_SECRET || 'somethingsecret',
        (err, decode) => {
          if (err) {
            res.status(401).send({ message: 'Invalid Token' });
          } else {
            req.user = decode;
            next();
          }
        }
      );
    } else {
      res.status(401).send({ message: 'No Token' });
    }
};

exports.authorizeRoles = (...roles) => {

    return (req , res , next) => {
      if ( roles.includes( req.user.role ) === false) {
          return next( new AppError("Unauthorized", 401) );
      }
  
      next();
   }
};
  