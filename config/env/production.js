module.exports = {
  app: {
    name: 'Cards for Humanity - Development'
  },
  facebook: {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://rainer-cfh-staging.herokuapp.com/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
    callbackURL: 'http://rainer-cfh-staging.herokuapp.com/auth/twitter/callback'
  },
  github: {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://rainer-cfh-staging.herokuapp.com/auth/github/callback'
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://rainer-cfh-staging.herokuapp.com/auth/google/callback'
  }
};
