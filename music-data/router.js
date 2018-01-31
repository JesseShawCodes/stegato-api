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
    MusicInput
        .find()
        .then(data => {
            for (var i = 0; i < data.length; i++) {
                console.log("Searching...")
                // console.log(req.body.user)
                // console.log(data[i].user)
                // console.log(req.body.collectionid)
                // console.log(data[i].collectionId)
                console.log(req.body.Rating)
                if (req.body.user == data[i].user && req.body.collectionid == data[i].collectionId) {
                    MusicInput.findOneAndUpdate({user: req.body.user, collectionId: req.body.collectionid}, {rating: req.body.Rating}, function(error, doc) {
                        if (error) {
                            throw error
                        }
                        else {
                            res.send("Rating has been updated");
                        }
                    })
                    console.log("Rating has been updated")
                }
                else {
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
                    MusicInput.create(submission, function(err, submission) {
                        console.log("Adding submission...")
                        if (err) { 
                            throw err; 
                        }
                        else {
                            //Do Nothing
                        }
                    })
                    break
                }
            }

        }
    )
});
/*

router.post('/:id', jsonParser, (req, res) => {
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
    MusicInput.create(submission, function(err, submission) {
        console.log("Adding submission");
        if (err) { 
            throw err; 
        }
        else {
            res.json({
                "We": "received it"
            })
        }
    })
});
*/

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
    console.log(req.body.mongoid);
    MusicInput.findByIdAndRemove(`${req.body.mongoid}`, function(err, doc) {
        console.log(err);
        if (err) {
            return sendError(res, err)
        }
    });
    res.status(204).end();
})

module.exports = {router};
