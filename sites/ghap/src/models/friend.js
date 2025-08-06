var mongo, bcrypt, friend;

mongo = require('mongoose');
bcrypt = require('bcrypt-nodejs');

friend = new mongo.Schema({
    friend: {
        mainfriendid: String,
        anotherfriendid: String,
    }
});

module.exports = mongo.model('Friend', friend);
