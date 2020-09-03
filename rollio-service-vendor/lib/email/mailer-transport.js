// DEPENDNECIES
const nd = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const {
    MAILGUN_DOMAIN, MAILGUN_API_KEY, SMTP_PORT, NODE_ENV,
} = require('../../config');

const prodTransport = nd.createTransport(mg({
    auth: {
      api_key: MAILGUN_API_KEY,
      domain: MAILGUN_DOMAIN,
    },
}));

const devTransport = nd.createTransport({
    port: SMTP_PORT,
    ignoreTLS: true,
});

const mailer = NODE_ENV === 'PRODUCTION' ? prodTransport : devTransport;

module.exports = mailer;