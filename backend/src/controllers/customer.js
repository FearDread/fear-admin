const Customer = require("../models/customer");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, AuthError } = require("../errors");

const register = async (req, res) => {
   const newUser = await Customer.create({ ...req.body });
   const token = newUser.getJWTToken();
   const user = await Customer.findOne({ _id: newUser._id }).select(
      "firstName lastName email username"
   );
   return res.status(StatusCodes.CREATED).json({ user, token });
};

const login = async (req, res) => {
   const { username, password } = req.body;
   if (!username || !password) {
      throw new BadRequestError("Please provide username and password");
   }
   const user = await Customer.findOne({ username });
   if (!user) {
      return(new AuthError("Please register"));
   }
   // compare password
   const isPasswordCorrect = await user.compare(password);
   if (!isPasswordCorrect) {
      throw new AuthError("Password Is incorrect");
   }
   const token = user.getJWTToken();
   const newUser = await Customer.findOne({ username }).select(
      "firstName lastName username email"
   );

   return res.status(StatusCodes.OK).json({ user: newUser, token });
};

module.exports = {
   register,
   login,
};
