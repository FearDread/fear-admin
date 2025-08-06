/* GHAP.com */
var server,
    host,
    port,
    fs,
    path,
    express,
    routes,
    mongoStr,
    passport,
    less,
    utapi,
    app,
    pub,
    bodyParser,
    mongo,
    flash,
    ultimate,
    assert;

/* MODS */
fs = require('fs');
path = require('path');
assert = require('assert');
flash = require('connect-flash');
express = require('express');
session = require('express-session');
less = require('less-middleware');
mongo = require('mongoose');
passport = require('passport');
bodyParser = require('body-parser');

/* APIs */
routes = require('./routes');
ultimate = require('./routes/api/ultimate');

/* Tools */
utils = require('./src/utils');
config = require('./src/config');
require('./src/passport')(passport);

/* APP */
app = express();

const GHAP = (( app ) => {
	pub = __dirname;

	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	app.set('views', pub + '/public/views');
	app.set('view engine', 'jade');

	app.use(less(path.join(pub, '/src', 'less'), {
	    dest: path.join(pub, '/public', 'css')
	}));

	app.use(express.static(path.join(pub, '/public')));
	app.use(session({ secret: config.secret })); 

	app.use(passport.initialize());
	app.use(passport.session()); 
	app.use(flash()); 

	routes.add(app);
	ultimate.add(app, passport);

	mongo.connect(config.db, function (err) {
	  if (err) {
	      console.log('Error connecting: ', err);
	      //assert.equal(err, null);
	  }
	  console.log('MongoDB connected at ' + config.db);
	  
	  server = app.listen(5000, function () {
	      host = server.address().address;
	      port = server.address().port;

	      console.log('GHAP.com listening at http://%s:%s', host, port);
	  });
	});

})( express() );


(async () => {

	async function start() {
		GHAP();

	}

	await start();

})( GHAP );
