const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
   //check header
   const authHeader = req.headers.authorization;
   if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new UnauthenticatedError("Authentication invalid"));
   }
   const token = authHeader.split(" ")[1];
   try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      //attach logic to job routes
      req.user = { user_id: payload.user_id || payload.userId };
      next();
   } catch (error) {
      return next(new UnauthenticatedError("Authentication Invalid"));
   }
};
module.exports = auth;
