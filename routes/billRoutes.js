const express = require("express");
const router = express.Router();

const { generateBill } = require("../controllers/billController");

router.get("/generate/:id", generateBill);

module.exports = router;

