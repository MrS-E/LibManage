const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '../sendmail/win/SendMail.exe'
});

module.exports = function (mailOptions) {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message send:", info.messageId)
    });
}