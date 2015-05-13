'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/team_test';
require('../server.js');

var fs = require('fs');
var bodyparser = ('body-parser');
var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;
var Team = require('../models/Team');
var Sql = require('sequelize');
var sql = new Sql('teams_dev', 'teams_dev', 'password', {
  dialect: 'postgres'
});

chai.use(chaihttp);

require('../server.js');

describe('Test that server can load a page', function () {
  //create task to test that server can load a basic web page
  it('Should have status 200', function (done) {
    chai.request('localhost:3000')
    .get('/')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(200);
      done();
    });
  });
});

describe('Test Requests', function () {

  it('Should respond to POST request by creating a new team', function (done) {
    chai.request('localhost:3000')
    .post('/api/teams/addteam')
    .send({id: -1, name: 'Mariners', wins: 12, losses: 17})
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(typeof res.body).to.eql('object');
      expect(res.body.name).to.eql('Mariners');
      expect(res.body.wins).to.eql(12);
      expect(res.body.losses).to.eql(17);
      done();
    })
  })

  // beforeEach(function (done) {
  //   var testTeam = new Team({name: 'Test Team', wins: 1, losses: 1});
  //   testTeam.save(function (err, data) {
  //     if (err) {
  //       throw err;
  //     }
  //     this.testTeam = data;
  //     done();
  //   }.bind(this));
  // });

  // beforeEach(function (done) {
  //   sql.sync()
  //   .then(function () {
  //     Team.send({id: 'test id', name: 'Test Team', wins: 1, losses: 1})
  //     .then(function (data) {
  //       res.json(data);
  //     })
  //     .error(function (err) {
  //       console.log(err);
  //       res.status(500).json({msg: 'internal server error'});
  //     })
  //     done();
  //   })
  // })

  // it('should make a test team beforeEach test', function () {
  //   expect(this.testTeam.name).to.eql('Test Team');
  //   expect(this.testTeam.wins).to.eql(1);
  //   expect(this.testTeam.losses).to.eql(1);
  // })

  // // test get request
  // it('Should respond to GET request with an array of teams', function (done) {
  //   chai.request('localhost:3000')
  //   .get('/api/teams')
  //   .end(function (err, res) {
  //     expect(err).to.eql(null);
  //     expect(Array.isArray(res.body)).to.eql(true);
  //     done();
  //   })
  // })

  // it('Should respond to POST request by creating a new team', function (done) {
  //   chai.request('localhost:3000')
  //   .post('/api/teams/addteam')
  //   .send({name: 'Mariners', wins: 12, losses: 17})
  //   .end(function (err, res) {
  //     expect(err).to.eql(null);
  //     expect(typeof res.body).to.eql('object');
  //     expect(res.body.name).to.eql('Mariners');
  //     expect(res.body.wins).to.eql(12);
  //     expect(res.body.losses).to.eql(17);
  //     expect(res.body).to.have.property('_id');
  //     done();
  //   })
  // })

  // it('Should respond to a PUT request by updating an existing team', function (done) {
  //   chai.request('localhost:3000')
  //   .put('/api/teams/updateteam/' + this.testTeam._id)
  //   .send({name: 'Mariners', wins: 12, losses: 17})
  //   .end(function (err, res) {
  //       expect(err).to.eql(null);
  //       expect(res.body.msg).to.eql('Mariners has been updated');
  //       done();
  //     });
  // });

  // it('Should delete a team with a DELETE request', function (done) {
  //   chai.request('localhost:3000')
  //   .del('/api/teams/delete/' + this.testTeam._id)
  //   .end(function (err, res) {
  //     expect(err).to.eql(null);
  //     expect(res.body.msg).to.eql('team deleted');
  //     done();
  //   });
  // });


})
