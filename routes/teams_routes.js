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

  // router.put('/teams/updateteam/:id', function (req, res) {
  //   var updatedTeam = req.body;
  //   Team.find({_id: req.params.id}, function (err, data) {
  //     if (err) {
  //       console.log(err);
  //       return res.status(406).json({msg: 'team not found'});
  //     }
  //   });

  //   delete updatedTeam._id;

  //   Team.findOneAndUpdate({'_id': req.params.id}, updatedTeam, function (err, data) {
  //     if (err && req.body.wins + req.body.losses < 162) {
  //       console.log(err);
  //       return res.status(500).json({msg: 'internal server error'});
  //     }
  //     if (err) {
  //       console.log(err);
  //       return res.status(406).json({msg: 'team not found'})
  //     }

  //     res.json({msg: updatedTeam.name + ' has been updated'});
  //   })
  // })

  // router.patch('/teams/newteam/:id', function (req, res) {
  //   var patchTeam = new Team(req.body);

  //   Team.find({_id: req.params.id}, function (err, data) {
  //     if (err) {
  //       delete patchTeam._id;
  //     }
  //   });

  //   patchTeam.save(function (err, data) {
  //     if (err && req.body.wins + req.body.losses < 162) {
  //       console.log(err);
  //       return res.status(500).json({msg: 'internal server error'});
  //     }
  //     if (err && req.body.wins + req.body.losses > 162) {
  //       console.log(err);
  //       return res.status(406).json({msg: 'team cannot have more than 162 games'});
  //     }

  //     res.json(data);
  //   })
  // })

  // router.delete('/teams/delete/:id', function (req, res) {
  //   Team.remove({'_id': req.params.id}, function (err, data) {
  //     if (err) {
  //       console.log(err);
  //       return res.status(500).json({msg: 'internal server error'});
  //     }
  //     res.json({msg: 'team deleted'});
  //   });
  // });

  router.delete('/teams/delete/:id', function (req, res) {
    sql.sync()
    .then(function () {
      Team.find({'id': req.params.id})
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
