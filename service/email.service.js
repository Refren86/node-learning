const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const { ApiError } = require('../error/api.error');
const emailTemplates = require('../email-templates');
const { NO_REPLY_EMAIL, NO_REPLY_EMAIL_PASS, WEB_URL } = require('../config/config');

const sendEmail = async (receiverMail, emailAction, locals = {}) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // automatically configured mails for gmail
    from: 'No reply', // not email, just name
    auth: {
      user: NO_REPLY_EMAIL,
      pass: NO_REPLY_EMAIL_PASS,
    },
  });

  const templateInfo = emailTemplates[emailAction];

  if (!templateInfo.subject || !templateInfo.templateName) {
    throw new ApiError('Wrong email template', 500);
  }

  const options = {
    viewEngine: {
      defaultLayout: 'main',
      layoutsDir: path.join(process.cwd(), 'email-templates', 'layouts'),
      partialsDir: path.join(process.cwd(), 'email-templates', 'partials'),
      extname: '.hbs',
    },
    extName: '.hbs',
    viewPath: path.join(process.cwd(), 'email-templates', 'views'),
  };

  transporter.use('compile', hbs(options));

  locals.frontendUrl = WEB_URL; // locals will always have frontendUrl

  // sendMail is async method
  return transporter.sendMail({
    to: receiverMail,
    subject: templateInfo.subject,
    template: templateInfo.templateName,
    context: locals
  });
};

module.exports = {
  sendEmail,
};
