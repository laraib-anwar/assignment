const jwt = require("jsonwebtoken");

const secret = "mySecretKey";

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.authToken || req.headers.authorization;
    console.log(token);
    let decodedData;

    if (token) {
      decodedData = jwt.verify(token, secret);

      req.userId = decodedData?.id;
    }

    next();
  } catch (error) {
    return res.redirect("login");
  }
};

module.exports = auth;
