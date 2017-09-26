const supertest = require('supertest');
const mongoose = require('mongoose');
const expect = require('expect');

const app = require('../../server');

const User = mongoose.model('User');
const request = supertest(app);

describe('POST: /api/search/users', () => {
  beforeEach((done) => {
    const testuser1 = new User({
      name: 'testname',
      username: 'testusername',
      email: 'testemail@gmail.com',
      password: 'testpassword'
    });
    const testuser2 = new User({
      name: 'testnametwo',
      username: 'testusernametwo',
      email: 'testemailtwo@gmail.com',
      password: 'testpasswordtwo'
    });
    testuser1.save();
    testuser2.save();
    done();
  });
  afterEach((done) => {
    User.remove({}, () => {
      done();
    });
  });
  describe('Search users with username or name', () => {
    it('should return status code 400 when a user does not enter a search query', (done) => {
      request
        .post('/api/search/users')
        .expect(402)
        .end((err, res) => {
          expect(res.body.message).toBe('Please enter a search query');
          done();
        });
    });
    it('should return one user when the user types two', (done) => {
      request
        .post('/api/search/users')
        .send({
          query: 'two'
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.length).toBe(1);
          expect(res.body[0].email).toBe('testemailtwo@gmail.com');
          expect(res.body[0].name).toBe('testnametwo');
          expect(res.body[0].username).toBe('testusernametwo');
          done();
        });
    });
    it('should return two users when the user types test', (done) => {
      request
        .post('/api/search/users')
        .send({
          query: 'test'
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.length).toBe(2);
          expect(res.body[0].email).toBe('testemail@gmail.com');
          expect(res.body[0].name).toBe('testname');
          expect(res.body[0].username).toBe('testusername');
          expect(res.body[1].email).toBe('testemailtwo@gmail.com');
          expect(res.body[1].name).toBe('testnametwo');
          expect(res.body[1].username).toBe('testusernametwo');
          done();
        });
    });
    it('should return no user when the user type oop', (done) => {
      request
        .post('/api/search/users')
        .send({
          query: 'oop'
        })
        .expect(402)
        .end((err, res) => {
          done();
        });
    });
  });
});
