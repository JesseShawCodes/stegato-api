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

/*
The Post works as follows

-When a user posts an album, a search is performed of the user level mongoDb
*/

router.post('/:id', jsonParser, (req, res) => {
    let update = false
    let oldRating;
    MusicInput
        .find()
        .then(function(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].collectionId == req.body.collectionid && data[i].user == req.body.user) {
                    update = true;
                    oldRating = data[i].rating
                    editPost(req, data[i].rating);              
                }
            }
            if (update === false) {
                console.log("Creating new Post");
                newPost(req)
            }
            }
        )
})

function newPost(data) {
    console.log("Adding post");
    var submission = new MusicInput();
    submission.artist = data.body.Artist;
    submission.album = data.body.album;
    submission.artwork = data.body.artwork;
    submission.genre = data.body.Genre;
    submission.itunesLink = data.body.BuyOnItunes;
    submission.rating = data.body.Rating;
    submission.user = data.params.id;
    submission.collectionId = data.body.collectionid;
    submission.releaseDate = data.body.releaseDate;
    MusicInput.create(submission, function(err, submission) {
        if (err) { 
            throw err; 
        }
        else {
            console.log("52: Received submission to database")
            leaderBoardFilter(data, null, null)
        }
    })
}


function editPost(data, ratingToUpdate) {
    console.log("editing post");
    MusicInput
    .findOneAndUpdate({collectionId: data.body.collectionid}, {$set:{rating: data.body.Rating}}, {new: true}, function(err, doc) {
        if(err){
            console.log("Something wrong when updating data!");
            throw err;
        }
        let oldRating = ratingToUpdate;
        let newRating = data.body.collectionid;
        leaderBoardFilter(data, newRating, oldRating);
    })
    return false  
}

function leaderBoardFilter(data, oldRate, newRate) {
    console.log("Leaderboard Filter Triggered");
    let update = false;
    leaderBoardInput
    .find()
    .then(function(results) {
        for (var i = 0; i < results.length; i++) {
            if (results[i].collectionId == data.body.collectionid) {
                console.log("It's a match bro")
                update = true;
                // console.log(data.body)
                // editLeaderBoardAlbum(results[i].collectionId, data.body.Rating, null)
                // break
            }
        }
        if (update == true) {
            console.log("Update leaderboard")
            editLeaderBoardAlbum(data, oldRate, newRate);
        }
        else if (update == false) {
            console.log("Create new data point")
            newLeaderBoardAlbum(data, oldRate, newRate);
        }
    })
}

function newLeaderBoardAlbum(data, oldRating, newRating) {
    var submission = new leaderBoardInput();
    submission.artist = data.body.Artist;
    submission.album = data.body.album;
    submission.artwork = data.body.artwork;
    submission.genre = data.body.Genre;
    submission.itunesLink = data.body.BuyOnItunes;
    submission.collectionId = data.body.collectionid;
    submission.releaseDate = data.body.releaseDate;
    submission.allRatings.push(data.body.Rating);
    leaderBoardInput
    .create(submission, function(err, submission) {
        if (err) {
            throw err;
        }
        else {
            console.log("Leaderboard data point created...")
            updateLeaderRating(submission.collectionId);
        }
    })
}

function editLeaderBoardAlbum(data, oldRating, newRating) {
    let updatedRatingsArray = [];
    let collectionToDelete = data.body.collectionid;
    MusicInput
    .find({collectionId: collectionToDelete})
    .then(function(data) {
        for (var i = 0; i < data.length; i++) {
            updatedRatingsArray.push(data[i].rating)
        }
        console.log(`141: ${updatedRatingsArray}`)
        leaderBoardInput
        .findOneAndUpdate({collectionId: collectionToDelete}, {$set: {allRatings: updatedRatingsArray}}, {new: true}, function(err, doc) {
            if (err) {
                console.log("something went wrong")
                throw err;
            }
            console.log(`148: ${updatedRatingsArray}`)
            updateLeaderRating(collectionToDelete);
        })
    })
}

function updateLeaderRating(identifier) {
    console.log("Testing")
    leaderBoardInput
    .findOne({collectionId: identifier})
    .then(function(data) {
        var total = 0
        var ratings = data.allRatings
        for (var i = 0; i < ratings.length; i++) {
            total += ratings[i]
        }
        var avg = total/ratings.length
        Math.round(avg * 100)/100
        console.log(`Line 165: ${avg}`)
        leaderBoardInput
        .findOneAndUpdate({collectionId: identifier}, {$set: {rating: avg}}, {new: true}, function(err, doc) {
           if (err) {
               console.log("something went wrong")
               throw err;
           }
       })
    })
    return false
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
            ret.sort(function(a, b) {
                return b.rating - a.rating;
            })
            // console.log(ret);
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

router.get('/get-data/leaderboard', jsonParser, (req, res) => {
    console.log("getting music data");
    let ret = [];
    leaderBoardInput
        .find()
        .then(music => {
            for (var i = 0; i < music.length; i++) {
                ret.push(music[i]);
            }
            // console.log(ret);
            ret.sort(function(a, b) {
                return b.rating - a.rating;
            })
            res.send(ret);
        })
})

module.exports = {router};
