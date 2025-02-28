const path = require('path');
const { Seeder } = require('mongo-seeding');

module.exports = {
        load: (env) => {
            if ( !env ) env = config;

            const dir = "models";
            const modPath = path.join(__dirname, dir);

            require('fs').readdirSync(modPath).forEach((file) => {
                const name = file.replace(/\.js$/, '');
                const Model = require(`./${dir}/${file}`);
                const data = require(`./data/${file}`);
                
                this.feed(Model, data)
            });
        },
        feed: async (Model, data) => {
            
            await Model.insertMany(data)
                .then((resp) => { console.log(resp, ":: Seeded successfully"); return true; })
                .catch((error) => { console.log(error);
                    throw Error(error);
                }
            );
        },
        seed: async (env) => {
            const seeder = new Seeder({
                database: {
                    name: env.DB_NAME,
                    uri: env.DB_LINK
                 },
                dropDatabase: false
            });
            const collections = seeder.readCollectionsFromPath(path.resolve(dir), options);
            
            seeder.import(collections)
                .then((resp) => { console.log('Success ', resp);})
                .catch((err) => { console.log('Error', err);
                    throw new Error(error);
                }
            );
        }
}