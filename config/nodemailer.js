const nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'abiliyok@gmail.com',
    pass: 'tiesan123'
  },
  tls: { rejectUnauthorized: false }
});

