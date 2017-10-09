const answers = require('../app/controllers/answers');
const users = require('../app/controllers/users');
const questions = require('../app/controllers/questions');
const avatars = require('../app/controllers/avatars');
const index = require('../app/controllers/index');
const game = require('../app/controllers/game');


module.exports = (app, passport, auth) => {
  // User Routes
  app.get('/signin', users.signin);
  app.get('/signup', users.signup);
  app.get('/chooseavatars', users.checkAvatar);
  app.get('/signout', users.signout);
  app.post('/api/search/users', users.search);
  app.post('/api/invite/send', users.sendInviteEmail);
  app.post('/api/user/password', users.password);
  app.post('/api/user/password/reset', users.resetPassword);

  // Setting up the users api
  app.post('/api/auth/signup', users.signup);
  app.post('/api/auth/login', users.login);
  app.post('/users', users.create);
  app.post('/users/avatars', users.avatars);
  // Donation Routes
  app.post('/donations', users.addDonation);

  app.post('/api/games/:id/start', game.saveGame);

  app.post('/users/session', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: 'Invalid email or password.'
  }), users.session);

  app.get('/users/me', users.me);
  app.get('/users/:userId', users.show);

  // Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email'],
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the github oauth routes
  app.get('/auth/github', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the google oauth routes
  app.get('/auth/google', passport.authenticate('google', {
    failureRedirect: '/signin',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }), users.signin);

  app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Finish with setting up the userId param
  app.param('userId', users.user);

  // Answer Routes
  app.post('/api/answers/add', answers.add);
  app.get('/answers/:answerId', answers.show);
  app.get('/answers', answers.all);
  // Finish with setting up the answerId param
  app.param('answerId', answers.answer);

  // Question Routes
  app.post('/api/questions/add', questions.add);
  app.get('/questions/:questionId', questions.show);
  app.get('/questions', questions.all);
  // Finish with setting up the questionId param
  app.param('questionId', questions.question);

  // Avatar Routes
  app.get('/avatars', avatars.allJSON);

  // Home route
  app.get('/play', index.play);
  app.get('/', index.render);
};
