const FEAR = require('../../backend/src/FEAR'),
	express = require('express'),
	path = require('path'),
	less = require('less-middleware');


(async () => {

	async function start() {

		const port = 3001;
		const routes = require('./routes');
		const ultimate = require('./routes/api/ultimate');
		const pub = __dirname;

		FEAR.app.engine('pug', require('pug').__express)
		FEAR.app.set('view engine', 'pug');
		FEAR.app.set('views', pub + '/public/views');


		FEAR.app.use(less(path.join(pub, '/src', 'less'), {
			dest: path.join(pub, '/public', 'css')
		}));

		FEAR.app.use(express.static(path.join(pub, '/public')));

		routes.add(FEAR.app);
		FEAR.db.run(FEAR.env, () => {
			FEAR.app.listen(port, (err) => {
				if (err) return;
				FEAR.log.info(`GHAP API Initialized :: Port ${port}`);
			});
		});
		
		process.on("unhandledRejection", FEAR.shutdown);
		process.on("uncaughtException", FEAR.shutdown);

		process.on('SIGTERM', FEAR.shutdown);
		process.on('SIGINT', FEAR.shutdown);
	}

	await start();

})(FEAR)