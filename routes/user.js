const express = require("express");
const router = express.Router();
const { login } = require("../controllers/user.js");
const { verifyCode } = require("../controllers/user.js");
const { sendSmsPhone } = require("../controllers/user.js");
const auth = require("../middleware/auth.js");
router.get("/", login);
router.post("/", sendSmsPhone);
router.post("/verify", verifyCode);
module.exports = router;
