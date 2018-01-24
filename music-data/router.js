'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const DATABASE_URL = require('../config');
const cors = require('cors');

const router = express.Router();

const jsonParser = bodyParser.json();

var { MusicInput } = require('./models')

router.post('/:id', jsonParser, (req, res) => {
    console.log(req.body);
    res.json({
        "We": "received it"
    })
    var submission = new MusicInput();
    submission.artist = req.body.Artist;
    submission.album = req.body.album;
    submission.artwork = req.body.artwork;
    submission.genre = req.body.genre;
    submission.itunesLink = req.body.buyonitunes;
    submission.rating = req.body.Rating;
    submission.user = req.params.id;
    submission.collectionId = req.body.collectionid;
    console.log(submission);
    MusicInput.create(submission, function(err, submission) {
      console.log("Adding submission");
      console.log(err);
    })
});

module.exports = {router};
