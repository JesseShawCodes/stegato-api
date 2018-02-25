
const mongo = require('mongodb');
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    }
});

var User = mongoose.model('User', userSchema);
module.exports = User


//Password encryption
module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in your password DB. 
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = function(in_username, callback) {
    var query = `{'username': '${in_username}'}`;
    console.log(User.find(`'username': '${query}'`));
}

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.comparePassword = function(canditatePassword, hash, callback) {
    // Load hash from your password DB.
    bcrypt.compare(canditatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}