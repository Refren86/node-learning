const path = require('path');
const nodemailer = require('nodemailer');
const emailTemplates = require('email-templates');

const { ApiError } = require('../error/api.error');
const EmailTemplates = require('../email-templates');
const { NO_REPLY_EMAIL, NO_REPLY_EMAIL_PASS } = require('../config/config');

const sendEmail = async (receiverMail, emailAction, locals = {}) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // automatically configured mails for gmail
    auth: {
      user: NO_REPLY_EMAIL,
      pass: NO_REPLY_EMAIL_PASS,
    },
  });

  const templateInfo = EmailTemplates[emailAction];

  if (!templateInfo) {
    throw new ApiError('Wrong email template', 500);
  }

  const templateRenderer = new emailTemplates({
    views: {
      root: path.join(process.cwd(), 'email-templates'),
    },
  });

  Object.assign(locals || {}, { frontendUrl: 'google.com' }); // locals will always have frontendUrl

  const html = await templateRenderer.render(templateInfo.templateName, locals); // pug file name

  // sendMail is async method
  return transporter.sendMail({
    from: 'No reply', // not email, just name
    to: receiverMail,
    subject: templateInfo.subject,
    html,
  });
};

module.exports = {
  sendEmail,
};
