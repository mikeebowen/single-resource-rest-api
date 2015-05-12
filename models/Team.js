'use strict';

// var mongoose = require('mongoose');

// var teamSchema = mongoose.Schema({
//   name: String,
//   wins: {type: Number, min: 0, max: 162},
//   losses: {type: Number, min: 0, max: 162}
// });

// module.exports = mongoose.model('Team', teamSchema);

var Sql = require('sequelize');
var sql = new Sql('teams_dev', 'teams_dev', 'password', {dialect: 'postgres'});

var Team = module.exports = sql.define('Team', {
  name: Sql.STRING,
  wins: Sql.INTEGER,
  losses: Sql.INTEGER
});

Team.sync();

// {name: 'Mariners', wins: 10, losses: 50}
