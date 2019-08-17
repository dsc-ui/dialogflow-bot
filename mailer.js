const nodemailer = require('nodemailer')

/** Send mail using Gmail SMTP */
module.exports.sendMail = (message, fn) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    transporter.sendMail(message, function (err, info) {
        if (err) {
            console.log(`MAIL ERROR :: ${err}`)
            fn(err)
        }
        else fn(null, false)
    });
}