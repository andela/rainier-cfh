const async = require('async');

module.exports = function (app, passport, auth) {
  //User Routes
  const users = require('../app/controllers/userAuth');

  app.get('/signout', users.signout);
  
  //Setting up the users api
  app.post('/api/auth/signup', users.signup);
  app.post('/api/auth/login', users.login);

  //Home route
  var index = require('../app/controllers/index');
  app.get('/play', index.play);
  app.get('/', index.render);
};
