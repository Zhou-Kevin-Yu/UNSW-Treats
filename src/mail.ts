import nodemailer from 'nodemailer';

// modified function courtesy of:https://ourcodeworld.com/articles/read/264/how-to-send-an-email-gmail-outlook-and-zoho-using-nodemailer-in-node-js
const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587, 
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: 'comp1531dreamteam22t2@outlook.com',
        pass: 'dreamteam1531@GAZZA'
    }
});

const code = 0;

const mailCongfig = {
    from: '"UNSW Treats - DREAM Edition" <comp1531dreamteam22t2@outlook.com>',
    to: 'comp1531dreamteam22t2@outlook.com',
    subject: 'Your Password Reset Code',
    text: `Hi, Please use the following code to reset your password: ${code}`,
};

transporter.sendMail(mailCongfig, function(error, info){
    if(error){
        return console.log(error);
    }

    console.log('Message sent: ' + info.response);
});