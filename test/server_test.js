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
  var randomId = Math.ceil(Math.random() * 300);

  it('Should respond to POST request by creating a new team', function (done) {
    chai.request('localhost:3000')
    .post('/api/teams/addteam')
    .send({id: randomId, name: 'Test Team', wins: 12, losses: 17})
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(typeof res.body).to.eql('object');
      expect(res.body.name).to.eql('Test Team');
      expect(res.body.wins).to.eql(12);
      expect(res.body.losses).to.eql(17);
      done();
    });
  });

  it('Should respond to PUT request by updating a team', function (done) {
    chai.request('localhost:3000')
    .put('/api/teams/updateteam/' + randomId)
    .send({name: 'Red Sox', wins: 1, losses: 100})
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('Red Sox has been updated');
      done();
    });
  });

  it('Should delete a team with a DELETE request', function (done) {
    chai.request('localhost:3000')
    .del('/api/teams/delete/' + randomId)
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('team deleted');
      done();
    });
  });

});
