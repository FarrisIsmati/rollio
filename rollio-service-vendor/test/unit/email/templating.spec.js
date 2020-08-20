// DEPENDENCIES
const chai = require('chai');
const sinon = require('sinon');
const nd = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const email = require('../../../lib/email/send-email');
const templating = require('../../../lib/email/templating');
const mailer = require('../../../lib/email/mailer-transport');

const { expect } = chai;

describe('Templating Email', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('expects _mjmlWrapper to return correct HTML string given arguments', async () => {
        const emailBody = 'email_body';
        const logo = 'logo1.svg';
        const title = 'title1';
        const result = templating._mjmlWrapper(emailBody, { logo, title });

        const expectedResult = `
        <mjml>
        <mj-head>
          <mj-preview>${title}</mj-preview>
          <mj-font name="Noto Sans" href="https://fonts.googleapis.com/css?family=Noto+Sans:300,400,500,700,900"></mj-font> 
          <mj-attributes>
            <mj-text line-height="1.5" color="#000" />
            <mj-button background-color="#147B87" color="#ffffff" font-size="14px" font-weight="400" />
            <mj-all font-family="Noto Sans, sans-serif" font-size="14px"></mj-all>
          </mj-attributes>
          <mj-style inline="inline">
            .h1 > div {
              font-size: 24px !important;
              font-weight: 900;
              color: #4A4A4A !important;
            }
            .h2 > div {
              font-size: 16px !important;
              font-weight: 700;
            }
            .footer > div {
              font-size: 13px !important;
              font-weight: 900;
            }
            .big-blue > div {
              font-size: 24px !important;
              color: #02616f !important;
            }
            .box {
              background-color: #f6f6f6;
              border-radius: 4px;
              padding: 27px 32px !important;
            }
            .inside-box {
              background-color: #f6f6f6;
              border-radius: 5px;
              padding-left: 27px;
              padding-right: 27px;
            }
            .logo-style {
              max-height: 100px;
            }
            .link {
              color: inherit !important;
            }
            .text-color {
              color: #4A4A4A;
            }
            .color {
              color: #4ca1a6;
            }
            .column-width {
              max-width: 20% !important;
            } 
            .no-padding {
              padding: 0px !important;
            }
            .outside-box-position {
              position: relative;
            }
            .padding-bottom-10 {
              padding: 0 0 10px 0;
            }
          </mj-style>
        </mj-head>
        <mj-body width="800px">
          <mj-section>
            <mj-column css-class="container-height" width="275px">
    <!--          <mj-image align="center" css-class="logo-style" alt="Rollio Logo" src="${logo}" />-->
            </mj-column>
          </mj-section>
          ${emailBody}
          <mj-section>
            <mj-column>
              <mj-spacer height="40px" />
    <!--          <mj-image width="200px" alt="Rollio Logo" src="${logo}" />-->
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
      `.replace(/\s/g,'');

        // Remove all whitespace before checking
        expect(result.replace(/\s/g,'')).to.be.equal(expectedResult);
    });

    // Way code is formatted makes it difficult ot test the other methods

    // it('expects getHtml to return an error if no template function is found', async () => {
    //   sinon.stub(templates, 'admin.new-location').returns(true);

    //   const getHtmlArgs = { context: {
    //       title: 'templateTitle'
    //     }, 
    //     template: 'admin.new-location',
    //     subject: 'test'
    //   };

    //   const result = templating.getHtml(getHtmlArgs);
    //   // Remove all whitespace before checking
    // });
});
