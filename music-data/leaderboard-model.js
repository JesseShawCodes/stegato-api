'use strict';
const mongo = require('mongodb');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const leaderBoardSchema = new Schema ({
    album: {type: String, default: '', required: true},
    artist: {type: String, default: '', required: true},
    artwork: {type: String, default: ''},
    genre: {type: String, default: ''},
    itunesLink: {type: String, default: ''},
    collectionId: {type: Number},
    releaseDate: {type: Date},
    allRatings: {type: [Number]},
    updated: { type: Date, default: Date.now },
    rating: {
        type: Number, 
        min: 1, 
        max: 5, 
        default: ''
    }
});

var leaderBoardInput = mongoose.model('leaderboard', leaderBoardSchema);

module.exports = {leaderBoardInput};
