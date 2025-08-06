var User, util, path, sdata, assert;

path = '../../../';

assert = require('assert');
utils = require(path + 'src/utils');
User = require(path + 'src/models/user.js');
sdata = require(path + 'routes/api/ultimate/sdata.js');

/* Ultimate Totals API */
exports.add = function(app, passport) {

    sdata.add(app);

    app.use('/ut/', function(req, res, next) {
        console.log('Ultimate Totals API :: ' + utils.path(req));

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        next(); 
    });

    app.route('/ut')

        .get(function (req, res) {

            var ghap = new User({
                name: 'Jim Bean',
                username: 'jimbean',
                email: 'fear@gmail.com',
                password: 'doggie'
            });

            ghap.password = ghap.hash(ghap.password);
            ghap.save(function (err) {
                if (err) {
                    res.json({message: 'user exists'});
                }

                res.json({message: 'Welcome to Ultimate Totals api!', user: ghap});
            });
        });

    app.route('/ut/login')

        .post(function (req, res) {
            var username = req.body.username,
                password = req.body.password,
                error = utils.addError('User does not exist.'); 

            User.findOne({username: username}, function (err, user) {
                if (err || !user) {
                    return res.json(error);
                }

                if (user && !user.verify(password)) {
                    error = utils.addError('Incorrect password.');
                    return res.json(error);
                }

                return res.json({success: true, message: 'login success', user:user, status: 200});
            });
        });

    app.route('/ut/user')
         
        .get(function (req, res) {
            error = utils.addError('No users found.');

            User.find({}, function (err, users) {
                if (users && users.length > 0) {

                    return res.json({success: true, users: users, status: 200});

                } else {

                    return res.json(error);
                }
            });
        })

        .post(function (req, res) {
            var user, newUser, error,
                fullname = req.body.first_name + ' ' + req.body.last_name,
                email = req.body.email,
                username = req.body.username,
                password = req.body.password;

            if (!req.user) {
                error = utils.addError('User already exists.');

                User.findOne({username: username}, function (err, user) {
                    if (err || !user) { 
                        return res.json(error);
                    }

                    if (user) {

                        return res.json(error);

                    } else {
                        newUser = new User({
                            name: fullname,
                            email: email,
                            username: username,
                            location: '',
                            password: newUser.hash(password)
                        });

                        newUser.save(function (err) {
                            error = utils.addError('Unable to save user.');

                            if (err) {
                                return res.json(error);
                            }

                            return res.json({success: true, user: newUser, status: 200});
                        });
                    }
                });

            } else {
                user = req.user;

                user.name = fullname;
                user.email = email;
                user.username = username;

                user.save(function (err) {
                    error = utils.addError('Unable to save user.'); 
                    if (err) { 
                        return res.json(error);
                    }

                    return res.json({user: user, status: 200});
                });
            }
        });

    app.route('/ut/user/:id')
         
        .get(function (req, res) {

            User.findById(req.param.id, function (err, user) {
                if (err || !user) {
                    return res.json(utils.addError('User does not exist.'));
                }

                return res.json({success: true, user: user, status: 200});
            });
        })

        .put(function (req, res) {

            user.update(req.body, function (err) {
                if (err) {
                    return res.json(utils.addError('Unable to updatge user.'));
                }

                return res.json({success: true, user: user, status: 200});
            });
        });
};
