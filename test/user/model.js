/**
 * Module dependencies.
 */
const supertest = require('supertest');
const mongoose = require('mongoose');
const should = require('should');
const expect = require('expect');

const app = require('../../server');

const User = mongoose.model('User');
const request = supertest(app);

//Globals
var user;

//The tests
describe('<Unit Test>', function() {
    describe('Model User:', function() {
        before(function(done) {
            user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password'
            });

            done();
        });

        describe('Method Save', function() {
            

            it('should be able to show an error when try to save witout name', function(done) {
                user.name = '';
                return user.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        });

        after(function(done) {
            done();
        });
    });
});

describe('POST: /api/auth/signup', () => {
  describe('when user tries to signup with no information', () => {
    it('should return status code 400 when all fields are empty', (done) => {
      request
        .post('/api/auth/signup')
        .expect(400)
        .end(done);
    });
  });
  
  describe('when user tries to login with incomplete information', () => {
    it('should return status code 400 when no email and password are supplied', (done) => {
      request
        .post('/api/auth/login')
        .expect(400)
        .end((err, res) => {
          expect(res.body.message).toBe('Field cannot be empty');
          done();
        });
    });
    it('should return status code 400 when no password is supplied', (done) => {
      request
        .post('/api/auth/login')
        .send({
          email: 'user@gmail.com',
        })
        .expect(400)
        .end((err, res) => {
          expect(res.body.message).toBe('Field cannot be empty');
          done();
        });
    });
    it('should return status code 400 when no username is supplied', (done) => {
      request
        .post('/api/auth/login')
        .send({
          password: 'password',
        })
        .expect(401)
        .end((err, res) => {
          expect(res.body.message).toBe('Field cannot be empty');
          done();
        });
    });
  });
});
