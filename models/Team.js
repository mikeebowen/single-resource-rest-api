'use strict';

var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
  name: String,
  wins: {type: Number, min: 0, max: 162},
  losses: {type: Number, min: 0, max: 162}
});

module.exports = mongoose.model('Team', teamSchema);

