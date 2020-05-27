const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const { MAILGUN_DOMAIN: domain, MAILGUN_API_KEY: api_key, SMTP_PORT: port, NODE_ENV } = require('../../../../config');

const FROM_EMAIL = 'Rollio <info@roll.io>';

const nodemailerMailgun = nodemailer.createTransport(mg({ auth: { api_key, domain } }));
const devMailer = nodemailer.createTransport({
  port,
  ignoreTLS: true,
});

// TODO: test out devMailer and confirm it is right!!!
// for some reason, not actually sending but just putting in a queue
const mailer = NODE_ENV === 'PRODUCTION' ? nodemailerMailgun : devMailer;

/*
Note that the to field is required and should be a string
containing 1 or more comma-separated addresses.
Additionally cc and bcc fields can be specified
*/

const sendEmail = ({
  to, subject, text, html, cc, bcc,
}) => {
  const data = {
    to, from: FROM_EMAIL, subject, text,
  };
  mailer.sendMail(data, (err, info) => {
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      console.log(`Response: ${info}`);
    }
  });
};

module.exports = {
  sendEmail,
};
