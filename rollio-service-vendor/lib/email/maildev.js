const MailDev = require('maildev');

const maildev = new MailDev({
  smtp: process.env.SMTP_PORT || 1025,
  verbose: true,
});

maildev.listen();

module.exports = maildev;
