// DEPENDENCIES
const sinon = require('sinon');
const nd = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const email = require('../../../lib/email/send-email');
const templating = require('../../../lib/email/templating');
const mailer = require('../../../lib/email/mailer-transport');

describe('Send Email', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('expects sendEmail to call mailer.sendMail with proper arguments', async () => {    
        const sendArgs = {
            to: 'farris.ismati@gmail.com', subject: 'hello', context: 'hi', cc: 'johnny.cool@gmail.com', bcc: 'johnny.cupcakes@hotmail.com',
        }

        const html = '<p>html</p>'
        const templatingGetHtmlStub = sinon.stub(templating, 'getHtml').returns(html);
    
        sinon.stub(nd, 'createTransport').returns({ 
            sendMail: () => true
        })
    
        const mailerSendMailStub = sinon.stub(mailer, 'sendMail').returns()
    
        const expectedArgument1 = {
            to: email.fixAddresses(sendArgs.to),
            bcc: "johnny.cupcakes@hotmail.com",
            cc: "johnny.cool@gmail.com",
            from: "Rollio <info@rollio.io>",
            subject: sendArgs.subject,
            html,
            ...(sendArgs.cc ? { cc: email.fixAddresses(sendArgs.cc) } : {}),
            ...(sendArgs.bcc ? { bcc: email.fixAddresses(sendArgs.bcc) } : {}),
        }

        await email.sendEmail(sendArgs);

        sinon.assert.calledWith(mailerSendMailStub, expectedArgument1);
    });
});
