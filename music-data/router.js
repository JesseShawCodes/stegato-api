'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const mongoose = require('mongoose');


const {User} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

router.get('/default', (req, res) => {
    return res.json({
      Hello: 'World'
    });
});

var MusicInput = require('./models')

router.post('/:id', (req, res) => {
    res.json({
        "Artist": `${req.headers.artist}`,
        "Album": `${req.headers.album}`,
        "Genre": `${req.headers.genre}`,
        "Artwork": `${req.headers.artwork}`,
        "Rating": `${req.headers.rating}`,
        "User": `${req.params.id}`,
        "Itunes-Link": `${req.params.buyonitunes}`
    });
    var submission = new MusicInput();
    /*
    var submission = new MusicInput();
    submission.artist = req.headers.artist;
    submission.album = req.headers.album;
    submission.rating = req.headers.rating;
    MusicInput.create(submission, function(err, submission) {
      console.log("Adding submission");
    })
    */
});

module.exports = {router};
