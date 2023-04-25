const dotenv = require("dotenv");
const express = require("express");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const serverless = require('serverless-http');
const userRouter = require("./routes/user.js");
dotenv.config();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/hello", userRouter);


//mongoose database connection

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

connectDB();



//setting up the prototype
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

// app.listen(port, function () {
//   console.log("app started successfully");
// });

module.exports.handler = serverless(app);
