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
}as any);
// not good code BUT transporter and typescript in this version dont play well

const code = 0;

export function sendMail(email: string, resetCode: string) {
    const mailCongfig = {
        from: '"UNSW Treats - DREAM Edition" <comp1531dreamteam22t2@outlook.com>',
        to: email,
        subject: 'Locked Out? - DREAM has your back.',
        text: `Use our state of the art reset code to get back into your account: ${resetCode} \n\nEnter code in at: auth/passwordreset/reset/v1 \n\n If you did not request this reset, please ignore this email.`,
    };
    
    transporter.sendMail(mailCongfig, function(error, info){
        if(error){
            return console.log(error);
        }
    
        console.log('Message sent: ' + info.response);
    });
}

// sendMail('comp1531dreamteam22t2@outlook.com', '0');