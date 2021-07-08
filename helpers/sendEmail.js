const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_KEY } = process.env;

sgMail.setApiKey(SENDGRID_KEY);

const sendEmail = async (email, verificationToken) => {
  const mail = {
    to: email,
    from: "deputatwladek@gmail.com",
    subject: "Email verification",
    html: `Thanks so much for joining my email test service!
Please click on the link below to complete your registration.
<a href="http://localhost:3000/api/users/verify/${verificationToken}">Click here</a>`,
  };
  try {
    const result = await sgMail.send(mail);
    return result;
  } catch (error) {
    console.log(error);
    error.message = `Email not send. Reason - ${error.message}`;
    throw error;
  }
};

module.exports = sendEmail;
