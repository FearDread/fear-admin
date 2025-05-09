const User = require('../../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = () => {
    // Maintaining persistent login sessions
    // serialized  authenticated user to the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // deserialized when subsequent requests are made
    passport.deserializeUser((id, done) => {
        User.findById(id).done((err, user) => {
            done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({
        usernameField : 'email',
        passReqToCallback : true 
    }, (req, email, password, done) => {
        process.nextTick(() => {
            User.findOne({'email': email}, (err, user) => {
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
    }, (req, email, done) => {

        process.nextTick(() => {
       
            if (!req.user) {
                User.findOne({'email': email}, (err, user) => {
                    if (err) return done(err);

                    if (user) return done(null, false, req.flash('signuperror', 'User already exists'));

                    const newUser = new User();

                    newUser.username = req.body.username;
                    newUser.email = email;
                    newUser.name = '';
                    newUser.address = '';

                    newUser.save((err) => {
                            if (err) throw err;

                            return done(null, newUser);
                        });
                })
            }}
        )})
    );
};
