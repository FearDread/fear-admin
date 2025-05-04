const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

module.exports = (passport) => {
    // Maintaining persistent login sessions
    // serialized  authenticated user to the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // deserialized when subsequent requests are made
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({
        usernameField : 'email',
        passReqToCallback : true 
    }, (req, email, password, done) => {
        process.nextTick(() => {
            User.findOne({'user.email': email}, (err, user) => {
                if (err) return done(err);

                if (!user) return done(null, false, req.flash('error', 'User does not exist.'));

                if (!user.verify(password)) return done(null, false, req.flash('error', 'Enter correct password'));
        
                return done(null, user);
            });
        });
    }));

    passport.use('register', new LocalStrategy({
        usernameField : 'email',
        passReqToCallback : true 
    }, (req, email, password, done) => {

        process.nextTick(function () {
       
            if (!req.user) {
                User.findOne({'user.email': email},
                function (err, user) {
                    if (err) { 
                        return done(err);
                    }

                    if (user) {

                        return done(null, false, req.flash('signuperror', 'User already exists'));

                    } else {

                        var newUser = new User();

                        newUser.user.username = req.body.username;
                        newUser.user.email = email;
                        newUser.user.password = newUser.generateHash(password);
                        newUser.user.name = '';
                        newUser.user.address = '';

                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }

                            return done(null, newUser);
                        });
                    }
                });

            } else {
                var user = req.user;

                user.user.username = req.body.username;
                user.user.email = email;
                user.user.password = user.generateHash(password);
                user.user.name = '';
                user.user.address = '';

                user.save(function (err) {
                    if (err) {
                        throw err;
                    }

                    return done(null, user);
                });
            }
        });
    }));
};
