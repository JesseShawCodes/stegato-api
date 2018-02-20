'use strict';
const mongo = require('mongodb');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const MusicSchema = new Schema ({
  album: {type: String, default: '', required: true},
  artist: {type: String, default: '', required: true},
  artwork: {type: String, default: ''},
  genre: {type: String, default: ''},
  itunesLink: {type: String, default: ''},
  rating: {type: Number, min: 1, max: 5, default: '', required: true},
  user: {type: String, required: true},
  collectionId: {type: Number},
  releaseDate: {type: Date},
  updated: { type: Date, default: Date.now }
});


var MusicInput = mongoose.model('music', MusicSchema);

module.exports = {MusicInput};
