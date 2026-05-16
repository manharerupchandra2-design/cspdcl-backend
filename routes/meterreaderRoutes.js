const express = require("express");
const router = express.Router();

const { meterreaderLogin, meterreaderSignup } = require("../controllers/meterreaderController");

router.post("/login", meterreaderLogin);
router.post("/signup", meterreaderSignup);

module.exports = router;