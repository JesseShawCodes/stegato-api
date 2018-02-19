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
                        }
                        console.log("Entry Updated!")
                    })
                    return false                    
                }
                else {
                    //do Nothing
                }
            }
            if (update === false) {
                console.log("Creating new entry");
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
            }
        })
})

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
            res.send(ret);
        })
})

module.exports = {router};
