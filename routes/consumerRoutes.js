const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware")
const {
  getConsumers,
  getConsumerDetail,
  getPendingConsumers
} = require("../controllers/consumerController");

router.get("/pending", verifyToken, getPendingConsumers);
router.get("/", verifyToken, getConsumers);
router.get("/:consumer_id", verifyToken, getConsumerDetail);


module.exports = router;

