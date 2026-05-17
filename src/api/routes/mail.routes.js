const express = require("express");
const { sendContactEmail } = require("../controllers/mail.controller");

const router = express.Router();

router.post("/", sendContactEmail);

module.exports = router;
