
const jwt = require("passport-jwt");
const passport = require("passport");

module.exports = ( app ) => {
  console.log("passed fear obj ::", app);
  const cfg = process.env;
  const Users = app.models.user;
  const params = {
    secretOrKey: cfg.JWT_SECRET || "somesecret",
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
      return passport.authenticate("jwt", process.env.JWT_SECRET);
    }
  };
};