

const express = require("express");
const upload = require('../middleware/upload');

const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  setReading, getReadingHistory
} = require("../controllers/readingController");

router.get("/history", getReadingHistory)
router.post("/:consumerId", upload.single('meter_photo'), setReading);

// router.put("/editReading/:reading_id", editReading)

module.exports = router;