// DEPENDENCIES
const logger = require('../log')('send-email');
const templating = require('./templating');
const mailer = require('./mailer-transport');

/*
Note that the 'to; field is required and should be a string
containing 1 or more comma-separated addresses.
Additionally cc and bcc fields can be specified, but are not required
*/

const email = {
  fixAddresses(address) {
    return (Array.isArray(address) ? address.split.join(',') : address)
  },
  async sendEmail(data) {
    const {
      to, subject, context, cc, bcc, from = 'Rollio <info@rollio.io>',
    } = data;
    if (!to || !subject || !context) {
      throw new Error('Required email fields are missing');
    }
    const html = await templating.getHtml(data);
    const messageData = {
      to: email.fixAddresses(to),
      from,
      subject,
      html,
      ...(cc ? { cc: email.fixAddresses(cc) } : {}),
      ...(bcc ? { bcc: email.fixAddresses(bcc) } : {}),
    };

    mailer.sendMail(messageData, (err, info) => {
      if (err) {
        logger.error(`Error: ${err}`);
      } else {
        logger.info(`Response: ${info}`);
      }
    });
  },
  // TODO: fill in with real admin account email address once registered
  async sendEmailToAdminAccount() {
    async data => sendEmail({ ...data, to: 'adminAccount@gmail.com' });
  }
}

module.exports = email;
