const express = require("express");
const router = express.Router();

const { generateBill } = require("../controllers/billController");

router.get("/generate/:bp_no", generateBill);

module.exports = router;

