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
    res.json({
        "We": "received it"
    })
    var submission = new MusicInput();
    console.log(req.body)
    submission.artist = req.body.Artist;
    submission.album = req.body.album;
    submission.artwork = req.body.artwork;
    submission.genre = req.body.Genre;
    submission.itunesLink = req.body.BuyOnItunes;
    submission.rating = req.body.Rating;
    submission.user = req.params.id;
    submission.collectionId = req.body.collectionid;
    console.log(submission);
    MusicInput.findOneAndUpdate({user: `${submission.user}`, collectionId: `${submission.collectionId}`})
    MusicInput.create(submission, function(err, submission) {
      console.log("Adding submission");
      if (err) { throw err; }
    })
});


router.get('/:id', jsonParser, (req, res) => {
    console.log(req.params.id);
    let ret = [];
    let rej = [];
    MusicInput
        .find()
        .then(post => {
            for (var i = 0; i < post.length; i++) {
                if (req.params.id === post[i].user) {
                    console.log(post[i]);
                    ret.push(post[i]);
                }
                else rej.push(post[i]);
            }
            console.log(ret);
            res.send(ret);
        })
})

router.delete('/', jsonParser, (req, res) => {
    console.log(req.body.mongoid)
    MusicInput.findByIdAndRemove(`${req.body.mongoid}`, function(err, doc) {
        console.log(err);
        if (err) {
            return sendError(res, err)
        }
    });
    res.status(204).end();
})

module.exports = {router};
