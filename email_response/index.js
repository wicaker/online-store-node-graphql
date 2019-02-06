const nodemailer = require("nodemailer");
const fs = require('fs');
const openingMessage = fs.readFileSync('email_response/message/opening.html','utf8');
const pendingSoldMessage = fs.readFileSync('email_response/message/pending_sold.html','utf8');
const successSoldMessage = fs.readFileSync('email_response/message/success_sold.html','utf8');

module.exports = {
  sendMail : (receiperMail, subject, text, receiperName, total) => {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      // port: 465,
      // secure: true, // use SSL
      auth: {
        user: process.env.NODEMAILER_GMAIL_EMAIL, // generated ethereal user
        pass: process.env.NODEMAILER_GMAIL_PASSWORD // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    let message = `${openingMessage} <span>${receiperName}</span>
      
    ${pendingSoldMessage} ${total}`;

    if(total === 'success') {
      message = `${openingMessage} <span>${receiperName}</span>
      
    ${successSoldMessage}`;
    }

    let mailOptions = {
      from: `"Electron Shop" <${process.env.NODEMAILER_EMAIL_SENDER}>`, // sender address
      to: receiperMail, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: message// html body
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      }
    });
  }
}