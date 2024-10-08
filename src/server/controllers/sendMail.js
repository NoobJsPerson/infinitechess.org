
const nodemailer = require('nodemailer');
const { DEV_BUILD, HOST_NAME } = require('../config/config');
const { logEvents } = require('../middleware/logEvents');

/**
 * Sends an account verification email to the specified member
 * @param {Object} newMember - The member's data
 */
const sendEmailConfirmation = function(newMember) {
    const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
    const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD; // App password generated by google, instead of using our main password

    const host = DEV_BUILD ? `localhost:${process.env.HTTPSPORT_LOCAL}` : HOST_NAME;
    const url_string = `https://${host}/verify/${newMember.username.toLowerCase()}/${newMember.verified[1]}`;
    const verificationUrl = new URL(url_string).toString();

    // Check if the email environment variables exist
    if (EMAIL_USERNAME === "" || EMAIL_APP_PASSWORD === "") {
        console.log("Email environment variables not specified. Not sending email. Click this link instead to verify:");
        console.log(verificationUrl);
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USERNAME,
            pass: EMAIL_APP_PASSWORD
        }
        // Enable if getting self signed certificate in certificate chain error.
        // Only useful in a development/testing environment.
        // , tls: {
        //     rejectUnauthorized: false
        // }
    });


    const mailOptions = {
        from: `Infinite Chess <${process.env.EMAIL_USERNAME}>`,
        to: newMember.email,
        subject: 'Verify your account',
        text: `
        Welcome to InfiniteChess.org!
    
        Thank you, ${newMember.username}, for creating an account. Please verify your account by visiting the following link:
    
        ${verificationUrl}
    
        If the link doesn't work, you can copy and paste the URL into your browser.
    
        If this wasn't you, please ignore this email or reply to let us know.
        `,
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #999; border-radius: 5px;">
            <h2 style="color: #333;">Welcome to InfiniteChess.org!</h2>
            <p style="font-size: 16px; color: #555;">Thank you, <strong>${newMember.username}</strong>, for creating an account. Please click the button below to verify your account:</p>
            
            <a href="${verificationUrl}" style="font-size: 16px; background-color: #fff; color: black; padding: 10px 20px; text-decoration: none; border: 1px solid black; border-radius: 6px; display: inline-block; margin: 20px 0;">Verify Account</a>
            
            <p style="font-size: 16px; color: #555;">If the link doesn't work, you can copy and paste the following URL into your browser:</p>
            <p style="font-size: 14px; color: #666; word-wrap: break-word;"><a href="${verificationUrl}" style="color: #007BFF; text-decoration: underline;">${verificationUrl}</a></p>

            <p style="font-size: 16px; color: #777;">If this wasn't you, please ignore this email or reply to let us know.</p>
        </div>
        `
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) logEvents(err.stack, 'errLog.txt', { print: true });
        else console.log(`Email is sent to member ${newMember.username}!`);
    });
};

module.exports = { sendEmailConfirmation };
