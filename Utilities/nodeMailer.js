const nodemailer = require("nodemailer");
const {nodemailerPassword} = require("./secrets");

// async..await is not allowed in global scope, must use a wrapper
async function nodeMailer(email, otp) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "zunaidshaik309@gmail.com", // generated ethereal user
      pass: nodemailerPassword, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Hello, Password request for FoodApp" <foodapp@hungerhead.com>', // sender address
    to: email, // list of receivers
    subject: "Password reset for your Food App 🍔...", // Subject line
    html: `<b>Your OTP for password reset is ${otp}. OTP will expire in 5 minutes...</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

nodeMailer().catch(console.error);

module.exports = {nodeMailer}