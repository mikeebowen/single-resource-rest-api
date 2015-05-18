'use strict';

var mongoose = require('mongoose');
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var time = new Date();
var db = mongoose.connection;
var passport = require('passport');

var teamsRoutes = express.Router();
var usersRoutes = express.Router();

process.env.APP_SECRET = process.env.APP_SECRET || 'change this change this change this!!!';

require('./lib/passport_strat')(passport);

require('./routes/teams_routes')(teamsRoutes);
require('./routes/auth_routes')(usersRoutes, passport);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('database connection made');
});

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/teams_development');

app.use(passport.initialize());

app.use('/api', teamsRoutes);
app.use('/api', usersRoutes);

app.get('/', function (req, res) {
  res.send('Server can load a page');
})

app.listen(port, function () {
  console.log('server started at: ' + time + ' on port: ' + port);
})
