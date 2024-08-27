import passport from "passport";
import {Strategy, ExtractJwt} from "passport-jwt";
import { Users } from "../../models/user";

module.exports = app => {

  const params = {
    secretOrKey: "somesecret",
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  };
  const strategy = new Strategy(params, (payload, done) => {
      Users.findById(payload.id)
        .then(user => {
          if (user) {
            return done(null, {
              id: user.id,
              email: user.email
            });
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
