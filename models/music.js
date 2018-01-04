const mongo = require('mongodb');
const mongoose = require('mongoose');

const musicPostSchema = mongoose.Schema({
  artist: {type: String, required: true},
  album: {type: String, required: true},
  rating: {type: Number, required: true}
});

var MusicInput = mongoose.model('Music', musicPostSchema);
module.exports = MusicInput