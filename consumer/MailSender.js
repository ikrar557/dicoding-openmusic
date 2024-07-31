const nodemailer = require('nodemailer');
const config = require('../src/utils/config');

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  }

  sendEmail(targetEmail, content) {
    const message = {
      from: 'Music Apps',
      to: targetEmail,
      subject: 'Ekspor Playlists',
      text: 'Terlampir hasil dari ekspor Playlists',
      attachments: [
        {
          filename: 'music_playlists.json',
          content,
        },
      ],
    };

    return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;
