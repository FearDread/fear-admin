var mongo, bcrypt, userSchema, Schema;

mongo = require('mongoose');
bcrypt = require('bcrypt-nodejs');
Schema = mongo.Schema;

// create a schema
userSchema = new Schema({
    name: String,
    email: {type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: Boolean,
    location: String,
    meta: {
        age: Number,
        website: String,
        avatar: String
    },
    token: String,
    premium: Boolean,
    created_at: Date,
    updated_at: Date
});

userSchema.methods.hash = function(password) {
    return bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(8),
        null
    );
};

userSchema.methods.verify = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.update = function(req, res) {
    var _this = this;

    this.name = req.body.name;
    this.address = req.body.address;

    this.save();
    res.json({user:_this});
};

userSchema.pre('save', function(next) {
    var date;

    date = new Date();

    this.updated_at = date;

    if (!this.created_at) {
        this.created_at = date;
    }

    next();
});

// export user model
module.exports = mongo.model('User', userSchema);
