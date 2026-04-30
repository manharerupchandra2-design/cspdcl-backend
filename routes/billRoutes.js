const express = require("express");
const router = express.Router();

const { generateBill } = require("../controllers/billController");

router.get("/generate/:consumer_id", generateBill);

module.exports = router;