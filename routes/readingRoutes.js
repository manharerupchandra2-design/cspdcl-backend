

const express = require("express");
const upload = require('../middleware/upload');

const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  setReading, getReadingHistory
} = require("../controllers/readingController");

router.get("/history", verifyToken, getReadingHistory);
const uploadMiddleware = (req, res, next) => {
  upload.single('meter_photo')(req, res, (err) => {
    if (err) {
      console.log('MULTER ERROR:', err.message);
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};

router.post("/:consumerId", uploadMiddleware, setReading);
module.exports = router;