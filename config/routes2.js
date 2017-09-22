const async = require('async');

module.exports = function (app, passport, auth) {
  //User Routes
  const users = require('../app/controllers/userAuth');

  //Setting up the users api
  app.post('/api/auth/signup', users.signup);
  app.post('/api/auth/login', users.login);
};
