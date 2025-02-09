const path = require('path');
const { Seeder } = require('mongo-seeding');

const Feeder = async () => {
    const config = {
        database: {
            name: process.env.DB_NAME ? process.env.DB_NAME : null,
            uri: props.uri ? props.uri : ""
         },
        dropDatabase: props.dropDatabase ? true : false
    };

    return {
        load: () => {
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
        seed: async (config) => {
            const seeder = new Seeder(config);
            const collections = seeder.readCollectionsFromPath(path.resolve(dir), options);
            
            seeder.import(collections)
                .then((resp) => { console.log('Success ', resp);})
                .catch((err) => { console.log('Error', err);
                    throw new Error(error);
                }
            );
        }
    }
}

module.exports = Feeder;