const express = require("express");
const router = express.Router();
const {verifyToken} = require("../middleware/authMiddleware")

const {getBillHistory, setBilling  } = require("../controllers/billController");


router.get("/history", getBillHistory);
router.post("/:reading_id", setBilling);


module.exports = router;

