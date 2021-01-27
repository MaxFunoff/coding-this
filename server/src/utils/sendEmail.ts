import nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, html: string) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();
    // console.log(testAccount)

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'mc2kd4vnflyowfl6@ethereal.email', // generated ethereal user
            pass: 'N48bDKD8WTqCrvHWAd', // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info;
    try {
        info = await transporter.sendMail({
            from: '"PlaceHolder Support"<doNotReply@placeholder.com>', // sender address
            to, // list of receivers
            subject: "Change Password", // Subject line
            html,
        });
    } catch (error) {
        console.log(error)
    }

    console.log(info)
    // console.log("Message sent: %s", info.messageId);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}