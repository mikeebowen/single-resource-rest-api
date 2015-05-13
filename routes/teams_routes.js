'use strict';

var Team = require('../models/Team');
var bodyparser = require('body-parser');
var Sql = require('sequelize');
var sql = new Sql('teams_dev', 'teams_dev', 'password', {
  dialect: 'postgres'
});

module.exports = function (router) {
  router.use(bodyparser.json());

  router.get('/teams', function (req, res) {
    sql.sync()
    .then(function () {
      Team.all()
      .then(function (data) {
        res.json(data);
      })
      .error(function (err) {
        console.log(err);
        res.status(500).json({msg: 'internal server error'});
      })
    })
  });

  router.post('/teams/addteam', function (req, res) {
    sql.sync()
    .then(function () {
      Team.create(req.body)
      .then(function (data) {
        res.json(data);
      })
      .error(function (err) {
        console.log(err);
        res.status(500).json({msg: 'internal server error'});
      })
    })
  });

  router.put('/teams/updateteam/:id', function (req, res) {
    sql.sync()
    .then(function () {
      Team.find(req.params.id)
      .then(function (data) {
        data.updateAttributes({
          name: req.body.name,
          wins: req.body.wins,
          losses: req.body.losses
        })
        .then(function () {
          return res.json({msg: req.body.name + ' has been updated'});
        })
        .error(function (err) {
          console.log(err);
          return res.json({msg: 'internal server error'});
        })
      })
    })
  });

  router.delete('/teams/delete/:id', function (req, res) {
    sql.sync()
    .then(function () {
      Team.find(req.params.id)
      .then(function (data) {
        data.destroy()
        res.json({msg: 'team deleted'});
      })
    })
    .error(function (err) {
      console.log(err);
      return res.status(500).json({msg: 'internal server error'})
    })
  });

}
