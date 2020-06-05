const nd = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const {
  MAILGUN_DOMAIN, MAILGUN_API_KEY, SMTP_PORT, NODE_ENV,
} = require('../../config');
const logger = require('../log')('send-email');
const getHtml = require('./templating')();


const ndMailGun = nd.createTransport(mg({ auth: { api_key: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN } }));
const devMailer = nd.createTransport({
  port: SMTP_PORT,
  ignoreTLS: true,
});
const mailer = NODE_ENV === 'PRODUCTION' ? ndMailGun : devMailer;

/*
Note that the 'to; field is required and should be a string
containing 1 or more comma-separated addresses.
Additionally cc and bcc fields can be specified, but are not required
*/

const fixAddresses = address => (Array.isArray(address) ? address.split.join(',') : address);

const sendEmail = async (data) => {
  const {
    to, subject, context, cc, bcc, from = 'Rollio <info@rollio.io>',
  } = data;
  if (!to || !subject || !context) {
    throw new Error('Required email fields are missing');
  }
  const html = await getHtml(data);
  const messageData = {
    to: fixAddresses(to),
    from,
    subject,
    html,
    ...(cc ? { cc: fixAddresses(cc) } : {}),
    ...(bcc ? { bcc: fixAddresses(bcc) } : {}),
  };
  mailer.sendMail(messageData, (err, info) => {
    if (err) {
      logger.error(`Error: ${err}`);
    } else {
      logger.info(`Response: ${info}`);
    }
  });
};

const sendEmailToAdminAccount = async data => sendEmail({ ...data, to: 'adminAccount@gmail.com' });

module.exports = {
  sendEmail,
  sendEmailToAdminAccount,
};
