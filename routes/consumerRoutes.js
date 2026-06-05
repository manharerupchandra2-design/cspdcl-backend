const express = require("express");
const router = express.Router();

const {
  getConsumers
  // addConsumer,
  // getAllConsumers,
  // getConsumersPreviousBill,
  // setReading,
  // getSingleConsumer,
  // removeConsumer
} = require("../controllers/consumerController");

// router.post("/reading/:consumer_id", setReading);
router.get("/", getConsumers);
// router.get("/getConsumersPreviousBill/:id", getConsumersPreviousBill);
// router.get("/:id", getSingleConsumer);
// router.delete("/:id",removeConsumer);

module.exports = router;

