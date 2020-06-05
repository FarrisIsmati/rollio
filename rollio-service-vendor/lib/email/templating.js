const fs = require('fs');
const { join } = require('path');
const { set, get } = require('lodash');
const glob = require('glob');
const mjml2html = require('mjml');
const Handlebars = require('handlebars');
const logger = require('../log')('templating');

const mjmlWrapper = (emailBody, params) => `
  <mjml>
    <mj-head>
      <mj-preview>${params.title}</mj-preview>
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
<!--          <mj-image align="center" css-class="logo-style" alt="Rollio Logo" src="${params.logo}" />-->
        </mj-column>
      </mj-section>
      ${emailBody}
      <mj-section>
        <mj-column>
          <mj-spacer height="40px" />
<!--          <mj-image width="200px" alt="Rollio Logo" src="${params.logo}" />-->
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`;

/**
 * Precompiles Handlebars templates
 * @return {function} hook function
 */
module.exports = function () {
  Handlebars.registerPartial(
    'layout',
    fs.readFileSync(join(__dirname, './templates/layout/base.handlebars'), 'utf-8'),
  );

  /**
     * Create an object that matches the email-templates directory with precompiled templates
     *
     * So for instance, email-templates/auth/invite.handlebars would be accessible
     * via 'auth.invite'.
     */
  const templates = {};
  const basePath = join(__dirname, './templates');
  const paths = glob.sync(join(basePath, '!(layout)/*.mjml.js'));
  paths.forEach((filePath) => {
    const objectPath = filePath.replace(basePath, '').replace('.mjml.js', '').replace(/^\//, '').replace('/', '.');
    const template = require(filePath);
    const compiledTemplate = (context) => {
      try {
        const mjmlTemplate = mjmlWrapper(template(context), context);
        const { html } = mjml2html(mjmlTemplate, {
          filePath,
          validationLevel: 'strict',
        });
        return html;
      } catch (err) {
        logger.error('failed to compile template', err);
        throw err;
      }
    };
    set(templates, objectPath, compiledTemplate);
  });

  const handlebarPaths = glob.sync(join(basePath, '!(layout)/*.handlebars'));
  handlebarPaths.forEach((filePath) => {
    const objectPath = filePath.replace(basePath, '').replace('.handlebars', '').replace(/^\//, '').replace('/', '.');
    const compiledTemplate = Handlebars.compile(fs.readFileSync(filePath, 'utf-8'));
    set(templates, objectPath, compiledTemplate);
  });
  return async function (data) {
    const { context, template, subject } = data;
    const templateFn = get(templates, template);
    if (!templateFn) {
      throw new Error(`${template} does not exist`);
    }
    context.title = context.title || subject;
    // context.server = context.server || wwConfig.customer.serverUrl;
    return templateFn(context);
  };
};