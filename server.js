'use strict';

// var mongoose = require('mongoose');
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var time = new Date();
// var db = mongoose.connection;

var teamsRouter = express.Router();

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function (callback) {
//   console.log('database connection made');
// });

// mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/teams_development');

require('./routes/teams_routes')(teamsRouter);

app.use('/api', teamsRouter);

app.get('/', function (req, res) {
  res.send('Server can load a page');
})

app.listen(port, function () {
  console.log('server started at: ' + time + ' on port: ' + port);
})
