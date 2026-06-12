

const express = require("express");
const upload = require('../middleware/upload');

const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  setReading, getReadingHistory, editReading
} = require("../controllers/readingController");
const uploadMiddleware = (req, res, next) => {
  upload.single('meter_photo')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err); // ← असली error यहाँ दिखेगी
      return res.status(500).json({ success: false, message: err.message });
    }
    next();
  });
};

router.post('/readings/:consumerId', uploadMiddleware, async (req, res) => {
  try {
    console.log('body:', req.body);
    console.log('file:', req.file); // ← comma use करो, + नहीं
    // ... बाकी logic
  } catch (err) {
    console.error('Route error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});
router.post("/:consumerId", upload.single('meter_photo'), setReading);
router.get("/history", getReadingHistory)
router.put("/editReading/:reading_id", editReading)

module.exports = router;