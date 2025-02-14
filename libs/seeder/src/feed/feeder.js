const path = require('path');
const { Seeder } = require('mongo-seeding');

const Feeder = (props) => {
    const config = {
        database: {
            name: props.name ? props.name : null,
            uri: props.uri ? props.uri : ""
        },
        dropDatabase: props.dropDatabase ? true : false
    }

    this.format = "JSON";
    this.seeder = new Seeder(config);

    this.swallow = async (Model, data) => {
        await Model.insertMany(data)
            .then((resp) => {
                console.log(resp, ":: Seeded successfully");
            })
            .catch((error) => {
                console.log(error);
            });
    }

    this.feed = (dir, options = null) => {
        const collections = {name: "", documents: []}

        (options) ? options : {
            extensions: ['ts', 'js', 'cjs', 'json'],
            ejsonParseOptions: {
                relaxed: false,
            },
            transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
        };
        collections = this.seeder.readCollectionsFromPath(
            path.resolve(dir),
            options
        );

        this.seeder.import(collections)
            .then((resp) => {
                console.log('Success ', resp);
                return true;
            })
            .catch((err) => {
                console.log('Error', err);
                throw new Error(error);
            });
    }
    
    this.wipe = ( opts ) => {

    }


    return this;
  };

module.exports = Feeder;