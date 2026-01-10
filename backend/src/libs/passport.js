const passport = require("passport")     
const User = require("../models/user")
require("dotenv").config();


   // serializing
   passport.serializeUser(function (user, done) {
       done(null, user.id);
   });

   // deserializing
   passport.deserializeUser(async function (id, done) {
       try {
           let user = await User.findById(id)
           done(null, user)
       } catch (err) {
           done(err, null);
       }

   });

   module.exports = passport