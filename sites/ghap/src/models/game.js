var mongo, gameSchema, Schema;

mongo = require('mongoose');
Schema = mongo.Schema;

gameSchema = new Schema({
    name: String,
    game_id: {type: Number, required: true},
    meta: {
        season: String,
        leauge: String,
        teams: {
            home: String,
            away: String
        }
    }
});

// export user model
module.exports = mongo.model('Game', gameSchema);
