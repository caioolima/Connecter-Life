const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Você pode usar qualquer serviço de e-mail
  auth: {
    type: 'OAuth2',
    user: 'caiolimaa2002@gmail.com',
    pass: 'Costa@1947#',
    clientId: '502312527959-vbop6foa30611sfkdka8hgatt1vj2l3e.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken: '1//04P9OAOkrXnWlCgYIARAAGAQSNwF-L9Ir-YePg_Fv822e5-YPn8wJAEafUX-9s3BARgz1poTypHo4fb_wBeT2uTdbBS4_1UPm4v8'
  },
});

module.exports = transporter;
