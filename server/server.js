const express = require("express");
const config = require('./config');
const cors = require('cors');
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const uuid = require('uuid/v4');
const session = require('express-session');

const User = require('./models/user');

require('dotenv').config();
global.__basedir = __dirname;

// Passport
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      if (!user.isMailConfirmed()) {
        return done(null, false, { message: 'Please confirm your email before' });
      }
      return done(null, user);
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

const app = express();

app.use(session({
  genid: (req) => {
    console.log(`${req.method} Request from client - SESSION_ID: ${req.sessionID}`)
    return uuid() // use UUIDs for session IDs
  },
  secret: "c+IoG?1:wih`],]L=XMlr'uYP~H,ac~3xTmq-Vb|Bn{)`$Oe?*GwT_/Mx2/#yy7",
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week (we can try with 5000 = 5s, cookie session will expire)
  },
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin:[`http://${config.client.host}:${config.client.port}`], // front end
  credentials: true // enable set cookie
}));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(fileUpload());
app.use('/public', express.static(__dirname + '/public'));
app.use('/torrents', express.static(__dirname + '/torrents'));

const db = require('./db')
db.on('error', console.error.bind(console, 'Database connection error:'));
db.once('open', () => {
  console.log('\x1b[36m%s\x1b[0m', '-> Database connection established');
});

app.use('/auth', require('./router/auth'));
app.use('/users', require('./router/users'));
app.use('/user', require('./router/user'));
app.use('/movies', require('./router/movies'));
app.use('/movie', require('./router/movie'));
app.use('/torrents', require('./router/torrents'));

app.listen(4001, () => {
  console.log("\x1b[33m%s\x1b[0m", `Server running on http://${config.server.host}:${config.server.port}/`);
});