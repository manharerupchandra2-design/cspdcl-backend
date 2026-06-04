const express = require("express");
const router = express.Router();

const {setBilling } = require("../controllers/billController");

router.post("/bill/:reading_id", setBilling);

module.exports = router;

