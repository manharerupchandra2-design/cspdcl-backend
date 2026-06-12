

const express = require("express");
const upload = require('../middleware/upload');

const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  setReading, getReadingHistory
} = require("../controllers/readingController");

router.get("/history", getReadingHistory)
const uploadMiddleware = (req, res, next) => {
  upload.single('meter_photo')(req, res, (err) => {
    if (err) {
      console.log('MULTER ERROR:', err.message);  // ← exact error dikhega
      return res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
    next();
  });
};

router.post("/:consumerId", uploadMiddleware, setReading);
// router.post("/:consumerId", upload.single('meter_photo'), setReading);

// router.put("/editReading/:reading_id", editReading)

module.exports = router;