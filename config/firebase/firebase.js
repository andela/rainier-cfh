const firebase = require('firebase');
// firebase configurations
const config = {
  apiKey: 'AIzaSyAdMyjJqQv8eP-ECzijp41brb0VdlTE-Dg',
  authDomain: 'cfh-chat-app.firebaseapp.com',
  databaseURL: 'https://cfh-chat-app.firebaseio.com',
  projectId: 'cfh-chat-app',
  storageBucket: 'cfh-chat-app.appspot.com',
  messagingSenderId: '1039015412470'
};

module.exports = firebase.initializeApp(config);
