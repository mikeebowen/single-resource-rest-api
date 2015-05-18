'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/team_test';
require('../server.js');

var fs = require('fs');
var bodyparser = ('body-parser');
var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;
var mongoose = require('mongoose');
var eat = require('eat');
var Team = require('../models/Team');
var User = require('../models/User');
var testToken = '';
var testTeam;

chai.use(chaihttp);

require('../server.js');

describe('Test that server can load a page', function () {

  before(function (done) {
    testTeam = new Team({name: 'Test Team', wins: 1, losses: 1, authorId: 'authorId'});
    testTeam.save(function (err, data) {
      if (err) {
        throw err;
      }
      testTeam = data;
      done();
    });

    var testUser = new User({username: 'test user 6', email: 'testuser6@example.com', password: 'password123'});

    testUser.basic.password = testUser.generateHash(testUser.basic.password, function (err, hash) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      testUser.basic.password = hash;
    });

    testUser.save(function (err, user) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'could not create new user'});
      }

      testUser.generateToken(process.env.APP_SECRET, function (err, token) {
        if (err) {
          console.log(err);
          return res.status(500).json({msg: 'errror generating token'});
        }
        testToken = token;
      });
    });
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(function () {
      done();
    });
  });

  it('Should have status 200', function (done) {
    chai.request('localhost:3000')
    .get('/')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(200);
      done();
    });
  });

  describe('Test Requests', function () {

    it('should make a test team before tests', function () {
      expect(testTeam.name).to.eql('Test Team');
      expect(testTeam.wins).to.eql(1);
      expect(testTeam.losses).to.eql(1);
    })

    // test get request
    it('Should respond to GET request with an array of teams', function (done) {
      chai.request('localhost:3000')
      .get('/api/teams')
      .end(function (err, res) {
        expect(err).to.eql(null);
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      })
    })

    it('Should respond to POST request by creating a new team', function (done) {
      chai.request('localhost:3000')
      .post('/api/teams/addteam')
      .send({name: 'Mariners', wins: 12, losses: 17, eat: testToken})
      .end(function (err, res) {
        expect(err).to.eql(null);
        expect(typeof res.body).to.eql('object');
        expect(res.body.name).to.eql('Mariners');
        expect(res.body.wins).to.eql(12);
        expect(res.body.losses).to.eql(17);
        expect(res.body).to.have.property('_id');
        done();
      })
    })

    it('Should respond to a PUT request by updating an existing team', function (done) {
      chai.request('localhost:3000')
      .put('/api/teams/updateteam/' + testTeam._id)
      .send({name: 'Mariners', wins: 12, losses: 17, eat: testToken})
      .end(function (err, res) {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('Mariners has been updated');
          done();
        });
    });

    it('Should delete a team with a DELETE request', function (done) {
      chai.request('localhost:3000')
      .del('/api/teams/delete/' + testTeam._id)
      .send({eat: testToken})
      .end(function (err, res) {
        expect(err).to.eql(null);
        expect(res.body.msg).to.eql('team deleted');
        done();
      });
    });

  });
});

