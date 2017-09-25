var async = require('async');

module.exports = function(app, passport, auth) {
    //User Routes
    var users = require('../app/controllers/users');
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/chooseavatars', users.checkAvatar);
    app.get('/signout', users.signout);

    //Setting up the users api
    app.post('/api/auth/signup', users.signup);
    app.post('/api/auth/login', users.login);
    app.post('/users/avatars', users.avatars);

    //Home route
    var index = require('../app/controllers/index');
    app.get('/play', index.play);
    app.get('/', index.render);

};
