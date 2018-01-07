const express = require('express');
const app = express();
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
const fetch = require('node-fetch');

//Model
var MusicInput = require('./models/music')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var router = express.Router();

//MongoDb
mongoose.connect('mongodb://localhost:27017/music');

app.get('/api/*', (req, res) => {
  res.json({ok: true});
  console.log("Get request made to /api/*")
});

app.get('/', (req, res) => {
  res.json({ok: true});
  console.log("Get request made to /")
});

var itunesUrl = "https://itunes.apple.com/search?term=";
var albumUrl = "https://itunes.apple.com/lookup?id=";

app.post('/board', (req, res) => {
  let artist = req.headers.artist;
  fetch(`${itunesUrl}${req.headers.artist}`).then(function (response){
    return response.json();
  })
  .then(function (json){
      // console.log(json.results);
      for (var i = 0; i < json.results.length; i++) {
        // console.log(json.results[i].artistName);
        if (json.results[i].artistName == artist) {
          // console.log("It's a match!");
          let artistId = json.results[i].artistId
          console.log(`${albumUrl}${artistId}&entity=album`)
          fetch(`${albumUrl}${artistId}&entity=album`).then(function(response) {
            return response.json()
          })
          .then(function (json) {
            let albumResults = json.results;
            console.log(albumResults);
          })
        }
        break
      }
  });
})

app.post('/rating/:id', (req, res) => {
  var submission = new MusicInput();
  submission.artist = req.headers.artist;
  submission.album = req.headers.album;
  submission.rating = req.headers.rating;
  submission.identification = req.params.id;
  console.log(req.params.id);
  MusicInput.create(submission, function(err, submission) {
    if(err) {
      console.log(err);
      console.log(`Error creating Data point: ${err[0]}`);
      return err;
    }
    else {
      console.log("Adding submission");
      res.status(201).send();
    }
  })
});

app.use(
  cors({
      origin: CLIENT_ORIGIN
  })
);

app.use(cors());
app.use('/api', router);

const PORT = 8080

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};