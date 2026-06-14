const express = require("express");
const router = express.Router();
const {verifyToken} = require("../middleware/authMiddleware")

const {getBillHistory, setBilling  } = require("../controllers/billController");


router.get("/history", verifyToken,getBillHistory);
router.post("/:reading_id", verifyToken,setBilling);


module.exports = router;

