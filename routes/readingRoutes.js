

const express = require("express");
const upload = require('../middleware/upload');

const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  setReading, getReadingHistory, editReading
} = require("../controllers/readingController");

router.post("/:consumerId", upload.single('meter_photo'), setReading);
router.get("/history", getReadingHistory)
router.put("/editReading/:reading_id", editReading)

module.exports = router;