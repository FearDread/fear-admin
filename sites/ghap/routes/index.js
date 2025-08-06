var json, mailer, utils;

mailer = require('nodemailer');
utils = require('../src/utils');

exports.add = function(app) {

    app.use(function(req, res, next) {
        console.log('Ghap API :: ' + req.url);

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        next(); 
    });

    app.get('/', function(req, res) {
        res.render('home', {});
    });

    app.post('/contact', function (req, res) {
        var options, transport;

        transport = mailer.createTransport('SMTP', {
            service: 'Gmail',
            auth: {
                user: "ghaptonstall@gmail.com",
                pass: "" 
            }
        });

        options = {
            from: req.body.name + ' &lt;' + req.body.email + '&gt;', //grab form data from the request body object
            to: 'ghaptonstall@gmail.com',
            subject: 'Website contact form',
            text: req.body.message
        };

        transport.sendMail(options, function (error, response) {
            if (error) {
                res.render('home', { 
                    title: 'GHAP.com - Contact',
                    msg: 'Error occured, message not sent.',
                    err: true,
                    page: 'contact' 
                });
            } else {
                res.render('contact', { 
                    title: 'GHAP.com - Contact',
                    msg: 'Message sent! Thank you.',
                    err: false,
                    page: 'contact'
                });
            }
        });
    });
};
