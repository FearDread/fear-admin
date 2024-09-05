const FEAR = require("../../FEAR");
const jwt = require("passport-jwt");
const passport = require("passport");

module.exports = ( FEAR ) => {
  const cfg = FEAR.config;
  const Users = FEAR.models.user;
  const params = {
    secretOrKey: cfg.jwt_secret || "somesecret",
    jwtFromRequest: jwt.ExtractJwt.fromAuthHeaderAsBearerToken()
  };

  const strategy = new jwt.Strategy(params, (payload, done) => {
      Users.findById(payload.id)
        .then(user => {
          if (user) {
            return done(null, {id: user.id, email: user.email});
          }
          return done(null, false);
        })
        .catch(error => done(error, null));
  });
  passport.use(strategy);
  
  return {
    initialize: () => {
      return passport.initialize();
    },
    authenticate: () => {
      return passport.authenticate("jwt", cfg.JWT_SECRET);
    }
  };
};
