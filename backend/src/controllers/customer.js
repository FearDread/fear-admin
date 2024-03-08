const Customer = require("../models/customer");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

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
      throw new UnauthenticatedError("Please register");
   }
   // compare password
   const isPasswordCorrect = await user.comparePasswords(password);
   if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Password Is incorrect");
   }
   const token = user.createJWT();
   const newUser = await User.findOne({ username }).select(
      "firstName lastName username email"
   );

   return res.status(StatusCodes.OK).json({ user: newUser, token });
};

module.exports = {
   register,
   login,
};
