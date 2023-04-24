const OTP = require("../models/user");

const dotenv = require("dotenv");
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const jwt = require("jsonwebtoken");

function login(req, res) {
  res.render("login");
}

//sending the otp to the user's phone

function sendSmsPhone(req, res) {
  //grabs user's phone number
  const number = req.body.number;

  //generates random 5 digits between 1 to 9
  let randomN = Math.floor(Math.random() * 90000) + 10000;

  //sends random number to users number (twilio)
  client.messages
    .create({
      body: "your otp verification code is " + randomN,
      from: "+16813293523",
      to: number,
    })
    .then(saveUser());

  function saveUser() {
    const newUser = new OTP({
      users: randomN,
      phone: number,
    });

    newUser
      .save()
      .then((_) => {
        res.render("verify", { number: number });
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

//verifying the otp sent from the user
function verifyCode(req, res) {
  //grabs user input
  const code = req.body.code;

  //matching database number with user input
  OTP.findOne({ users: code })
    .exec()
    .then((user) => {
      const createdAtMs = new Date(user.createdAt).getTime();

      // Calculate the current time in milliseconds
      const currentTimeMs = new Date().getTime();

      // Calculate the time difference in seconds
      const timeDiffSecs = (currentTimeMs - createdAtMs) / 1000;

      // Check if the time difference is greater than 2 minutes (120 seconds)
      if (timeDiffSecs > 120) {
        res.render("expired"); // Password has expired
        OTP.findOneAndDelete(code)
          .then((result) => {
            console.log("deleted"); // { _id: '12345', name: 'John' }
          })
          .catch((err) => {
            console.error(err);
          });
      } else if (user) {
       //creating the jwt token
        const payload = { user: user };
        const secretKey = "mySecretKey";

        const token = jwt.sign(payload, secretKey, { expiresIn: "2m" });
        res.cookie("authToken", token);
        res.render("success");
        OTP.findOneAndDelete(code)
          .then((result) => {
            console.log("deleted"); // { _id: '12345', name: 'John' }
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        res.render("error");
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { login, verifyCode, sendSmsPhone };
