const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const secret = require("../config/secret");
const User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user._id); // Only serialize user ID, not entire user object
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .lean()
    .exec()
    .then((user) => done(null, user))
    .catch((err) => done(err, null));
});

/**
 * Finds or creates a user from OAuth profile
 */
function findOrCreateOAuthUser(profile, provider, accessToken) {
  const query = { [`${provider}Id`]: profile.id };
  
  return User.findOne(query)
    .then((user) => {
      if (user) {
        return user;
      }

      // Create new user
      const userData = {
        [`${provider}Id`]: profile.id,
        [`${provider}AccessToken`]: accessToken,
        username: profile.displayName,
        email: profile._json?.email || profile.emails?.[0]?.value,
      };

      if (provider === "facebook") {
        userData.tokens = [{ kind: "facebook", token: accessToken }];
        userData.profile = {
          name: profile.displayName,
          picture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
        };
      }

      return User.create(userData);
    })
    .then((user) => {
      // If user already existed, return immediately
      if (user.createdAt && Date.now() - user.createdAt > 1000) {
        return user;
      }
      
      // Create cart for new user
      return createUserCart(user._id).then(() => user);
    });
}

// ============================================
// Strategy Configurations
// ============================================

/**
 * Local Strategy (Email/Password Login)
 */
passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      User.findOne({ email: email.toLowerCase() })
        .then((user) => {
          if (!user) {
            return done(null, false, req.flash("loginMessage", "No user found with this email"));
          }

          const isValidPassword = user.comparePassword(password);
          
          if (!isValidPassword) {
            return done(null, false, req.flash("loginMessage", "Incorrect password"));
          }

          return done(null, user);
        })
        .catch((err) => done(err));
    }
  )
);

/**
 * Google OAuth Strategy
 */
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:4000/fear/api/auth/google",
      scope: ["profile", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      findOrCreateOAuthUser(profile, "google", accessToken)
        .then((user) => done(null, user))
        .catch((err) => done(err, false));
    }
  )
);

/**
 * Facebook OAuth Strategy
 */
passport.use(
  "facebook",
  new FacebookStrategy(
    {
      clientID: secret.facebook.clientID,
      clientSecret: secret.facebook.clientSecret,
      callbackURL: secret.facebook.callbackURL,
      profileFields: ["id", "displayName", "email", "picture.type(large)"],
    },
    (accessToken, refreshToken, profile, done) => {
      findOrCreateOAuthUser(profile, "facebook", accessToken)
        .then((user) => done(null, user))
        .catch((err) => done(err, false));
    }
  )
);

module.exports = passport;