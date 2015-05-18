'use strict';

var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
  authorId: {type: String, required: true},
  name: {type: String, required: true},
  wins: {type: Number, min: 0, max: 162, required: true},
  losses: {type: Number, min: 0, max: 162, required: true}
});

module.exports = mongoose.model('Team', teamSchema);

// {name: 'test team 1', wins: 1, losses: 1, eat: ''}
