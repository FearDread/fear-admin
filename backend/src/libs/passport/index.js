// needed for local authentication
const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const secret = require("../config/secret");
const User = require("../models/user");
const async = require("async");
const Cart = require("../models/cart");

// serialize and deserialize
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// custom function validate
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};
// give the middleware a name, and create a new anonymous instance of LocalStrategy



passport.use(
  "google",
  new GoogleStrategy({
       clientID: process.env.GOOGLE_CLIENT_ID,
       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
       callbackURL: "http://localhost:4000/fear/api/auth/google",
       scope: ['profile', 'email']
   },
       async function (accessToken, refreshToken, profile, cb) {
           try {
               let user = await User.findOne({
                   googleId: profile.id
               })
               if (user) return cb(null, user)
               user = await User.create({
                   googleAccessToken: accessToken,
                   googleId: profile.id,
                   username:profile.displayName,
               })
               cb(null, user)
           } catch (err) {
               cb(err, false)

           }

       }
   ));
passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      // find a specific email
      User.findOne({ email: email }, (err, user) => {
        // incase of an error return a callback
        if (err) return done(err);

        if (!user) {
          return done(
            null,
            false,
            req.flash("loginMessage", "No user with such credentials found")
          );
        }

        // compare user provided password and the database one
        if (!user.comparePassword(password)) {
          return done(
            null,
            false,
            req.flash("loginMessage", "Oops! Wrong credentials")
          );
        }

        // return user object
        return done(null, user);
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    secret.facebook,
    (token, refreshToken, profile, done) => {
      User.findOne({ facebook: profile.id }, (err, user) => {
        if (err) return next(err);

        if (user) {
          return done(null, user);
        } else {
          async.waterfall([
            (callback) => {
              const newUser = new User();
              newUser.email = profile._json.email;
              newUser.facebook = profile.id;
              newUser.tokens.push({ kind: "facebook", token: token });
              newUser.profile.name = profile.displayName;
              newUser.profile.picture =
                "https://graph.facebook.com/" +
                profile.id +
                "/picture?type=large";

              newUser.save((err) => {
                if (err) return next(err);
                callback(err, newUser._id);
              });
            },
            (newUser) => {
              const cart = new Cart();

              cart.owner = newUser._id;
              cart.save((err) => {
                if (err) return done(err);
                return done(err, newUser);
              });
            },
          ]);
        }
      });
    }
  )
);

