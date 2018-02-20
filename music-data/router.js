'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const DATABASE_URL = require('../config');
const cors = require('cors');

const router = express.Router();

const jsonParser = bodyParser.json();

/*User Music Data Posting from users*/

var { MusicInput } = require('./models')
var { leaderBoardInput } = require('./leaderboard-model');

router.post('/:id', jsonParser, (req, res) => {
    MusicInput
        .find()
        .then(function(data) { 
            let update = false;
            for (var i = 0; i < data.length; i++) {
                if (data[i].collectionId == req.body.collectionid && data[i].user == req.body.user) {
                    update = true;
                    MusicInput
                    .findOneAndUpdate({collectionId: req.body.collectionid}, {$set:{rating: req.body.Rating}}, {new: true}, function(err, doc) {
                        if(err){
                            console.log("Something wrong when updating data!");
                            throw err;
                        }
                        console.log("Entry Updated!")
                        let oldRating = data[i].rating
                        leaderBoardInput
                        .find({collectionId: req.body.collectionid})
                        .then(function(data) {
                            let ratingsArray = data[0].allRatings;
                            console.log(data[0]._id)
                            console.log(`New rating is ${req.body.Rating}`)
                            console.log(ratingsArray);
                            ratingsArray.push(req.body.Rating);
                            for (var i = 0; i < ratingsArray.length; i++) {
                                if (ratingsArray[i] === oldRating) {
                                    console.log("It's a match");
                                    ratingsArray.splice(i, 1);
                                    break
                                }
                            }
                            console.log(ratingsArray);
                            leaderBoardInput
                            .findByIdAndUpdate(data[0]._id, {$set: {allRatings: ratingsArray}}, {new: true}, function(err, doc) {
                                if(err){
                                    console.log("Something wrong when updating data!");
                                    throw err;
                                }
                            })
                        })
                    })
                    return false                    
                }
                else {
                    //do Nothing
                }
            }
            if (update === false) {
                var submission = new MusicInput();
                submission.artist = req.body.Artist;
                submission.album = req.body.album;
                submission.artwork = req.body.artwork;
                submission.genre = req.body.Genre;
                submission.itunesLink = req.body.BuyOnItunes;
                submission.rating = req.body.Rating;
                submission.user = req.params.id;
                submission.collectionId = req.body.collectionid;
                submission.releaseDate = req.body.releaseDate;
                MusicInput.create(submission, function(err, submission) {
                    if (err) { 
                        throw err; 
                    }
                    else {
                        console.log("88: Received submission to database")
                    }
                })
                /*Leaderboard Inputs*/
                let ratings = [];
                leaderBoardInput
                    .find({'collectionId': `${req.body.collectionid}`})
                    .then(function(data) {
                        var submission = new leaderBoardInput();
                        submission.artist = req.body.Artist;
                        submission.album = req.body.album;
                        submission.artwork = req.body.artwork;
                        submission.genre = req.body.Genre;
                        submission.itunesLink = req.body.BuyOnItunes;
                        submission.collectionId = req.body.collectionid;
                        submission.releaseDate = req.body.releaseDate;
                        submission.allRatings.push(req.body.Rating);
                        leaderBoardInput
                        .create(submission, function(err, submission) {
                            if (err) {
                                throw err;
                            }
                            else {
                                res.json({
                                    "Hey": "Leaderboard has been updated"
                                })
                            }
                            updateRatingArray(req.body.collectionid, req.body.Rating)
                        })
                    })
            }
        })
})

function updateRatingArray(id, rating) {
    let ratingsArray = []
    leaderBoardInput
    .find({'collectionId': `${id}`})
    .then(function(data) {
        ratingsArray = data[0].allRatings
        var total = 0
        ratingsArray = data[0].allRatings
        for (var i = 0; i < ratingsArray.length; i++) {
            total += ratingsArray[i]
        }
        var avg = total/ratingsArray.length
        leaderBoardInput
        .findByIdAndUpdate(data[0]._id, {$set:{rating: avg}}, {new: true}, function(err, doc) {
            if(err) {
                throw err;
            }
        })
    })
}

router.get('/:id', jsonParser, (req, res) => {
    let ret = [];
    let rej = [];
    MusicInput
        .find()
        .then(post => {
            for (var i = 0; i < post.length; i++) {
                if (req.params.id === post[i].user) {
                    ret.push(post[i]);
                }
                else rej.push(post[i]);
            }
            console.log(ret);
            res.send(ret);
        })
})

router.delete('/', jsonParser, (req, res) => {
    MusicInput.findByIdAndRemove(`${req.body.mongoid}`, function(err, doc) {
        if (err) {
            return sendError(res, err)
        }
    });
    res.status(204).end();
})

/*Leaderboard Data*/

router.post('/repost/leaderboard', jsonParser, (req, res) => {
    console.log("LEADBOARD!!");
    res.send("Hi");
})

router.get('/get-data/leaderboard', jsonParser, (req, res) => {
    console.log("getting music data");
    let ret = [];
    MusicInput
        .find()
        .then(music => {
            for (var i = 0; i < music.length; i++) {
                ret.push(music[i]);
            }
            console.log(ret);
            ret.sort(function(a, b) {
                return b.rating - a.rating;
            })
            res.send(ret);
        })
})

module.exports = {router};
