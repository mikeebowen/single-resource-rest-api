'use strict';

var User = require('../models/User');
var bodyparser = require('body-parser');

function makeRandomString () {
    var outputString = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<,>.?/';
    var randomNumber = Math.ceil(Math.random() * 10) + 10;
    for( var i = 0; i < randomNumber; i++ ){
        outputString += possible.charAt(Math.floor(Math.random() * possible.length));
    };
    return outputString;
}

module.exports = function (router, passport) {
  router.use(bodyparser.json());

  router.get('/showusers', function (req, res) {
    User.find({}, function (err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }

      res.json(data);
    });
  });

  router.post('/create_user', function (req, res) {
    var newUserData = JSON.parse(JSON.stringify(req.body));
    delete newUserData.email;
    delete newUserData.password;
    var newUser = new User(newUserData);
    newUser.randomString = makeRandomString();
    newUser.basic.email = req.body.email;
    newUser.generateHash(req.body.password, function (err, hash) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      newUser.basic.password = hash;
    });

    newUser.save(function (err, user) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'could not create new user'});
      }

      user.generateToken(process.env.APP_SECRET, function (err, token) {
        if (err) {
          console.log(err);
          return res.status(500).json({msg: 'errror generating token'});
        }
        res.json({token: token});
      });

    });
  });

  router.get('/sign_in', passport.authenticate('basic', {session: false}), function (req, res) {
    console.log('REQ.USER : ' + req.user);
    req.user.generateToken(process.env.APP_SECRET, function (err, token) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'error generating token'});
      }
      res.json({token: token});
    })
  })
};
