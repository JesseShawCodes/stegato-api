const express = require('express');
const app = express();
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongo = require('mongodb');
const mongoose = require('mongoose');
var db = mongoose.connection;

//Model
var MusicInput = require('./models/music')

app.get('/api/*', (req, res) => {
  res.json({ok: true});
  console.log("Get request made to /api/*")
});

app.get('/', (req, res) => {
  res.json({ok: true});
  console.log("Get request made to /")
});


app.post('/album/', (req, res) => {
  res.json({
    "Artist": `${req.headers.artist}`,
    "Album": `${req.headers.album}`,
    "Rating": `${req.headers.rating}`
  });
  var submission = new MusicInput();
  submission.artist = req.headers.artist;
  submission.album = req.headers.album;
  submission.rating = req.headers.rating;
  MusicInput.create(submission, function(err, submission) {
    console.log("Adding submission");
  })
});

app.use(
  cors({
      origin: CLIENT_ORIGIN
  })
);

const PORT = 8080

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};