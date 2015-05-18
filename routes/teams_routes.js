'use strict';

var Team = require('../models/Team');
var bodyparser = require('body-parser');
var eatAuth = require('../lib/eat_auth')(process.env.APP_SECRET);

module.exports = function (router) {
  router.use(bodyparser.json());

  router.get('/teams', function (req, res) {
    Team.find({}, function (err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }

      res.json(data);
    });
  });

  router.get('/teams/myteams', eatAuth, function (req, res) {
    Team.find({authorId: req.user._id}, function (err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }

      res.json(data);
    });
  });

  router.post('/teams/addteam', eatAuth, function (req, res) {
    //create new instance of Team from the info entered in body response
    var newTeam = new Team(req.body);
    newTeam.authorId = req.user._id;
    // use save method on newTeam to save data entered in body to database
    newTeam.save(function (err, data) {
      if (err && req.body.wins + req.body.losses < 162) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      if (err && req.body.wins + req.body.losses > 162) {
        console.log(err);
        return res.status(406).json({msg: 'team cannot have more than 162 games'});
      }

      res.json(data);
    })
  })

  router.put('/teams/updateteam/:id', eatAuth, function (req, res) {
    var updatedTeam = req.body;
    Team.find({_id: req.params.id}, function (err, data) {
      if (err) {
        console.log(err);
        return res.status(406).json({msg: 'team not found'});
      }
    });

    delete updatedTeam._id;

    Team.findOneAndUpdate({'_id': req.params.id}, updatedTeam, function (err, data) {
      if (err && req.body.wins + req.body.losses < 162) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      if (err) {
        console.log(err);
        return res.status(406).json({msg: 'team not found'})
      }

      return res.json({msg: updatedTeam.name + ' has been updated'});
    })
  })

  router.delete('/teams/delete/:id', eatAuth, function (req, res) {
    Team.remove({'_id': req.params.id}, function (err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      res.json({msg: 'team deleted'});
    });
  });

}
