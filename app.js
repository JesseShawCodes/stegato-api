const express = require('express');
const app = express();
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const morgan = require('morgan');
const passport = require('passport');

// Logging
app.use(morgan('common'));

//Model
var MusicInput = require('./models/music')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var router = express.Router();

//MongoDb
mongoose.connect('mongodb://localhost:27017/music');

// Here we use destructuring assignment with renaming so the two variables
// called router (from ./users and ./auth) have different names
// For example:
// const actorSurnames = { james: "Stewart", robert: "De Niro" };
// const { james: jimmy, robert: bobby } = actorSurnames;
// console.log(jimmy); // Stewart - the variable name is jimmy, not james
// console.log(bobby); // De Niro - the variable name is bobby, not robert
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});


app.get('/api/*', (req, res) => {
  res.json({ok: true});
  console.log("Get request made to /api/*")
});

app.get('/', (req, res) => {
  res.json({ok: true});
  console.log("Get request made to /")
});

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

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});


app.use('/api', router);

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };


const PORT = 8080

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};