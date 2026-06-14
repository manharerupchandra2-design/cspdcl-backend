const express = require("express");
const router = express.Router();

const {setBilling } = require("../controllers/billController");

router.post("/:reading_id", setBilling);
// router.get("/history", getBillHistory);

module.exports = router;

