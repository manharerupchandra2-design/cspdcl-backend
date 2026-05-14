const express = require("express");
const router = express.Router();

const {
  addConsumer,
  getAllConsumers,
  getAllConsumersDetail,
  getSingleConsumer,
  removeConsumer
} = require("../controllers/consumerController");

router.post("/", addConsumer);
router.get("/", getAllConsumers);
router.post("/getAllConsumersDetail/:bp_no", getAllConsumersDetail);
router.get("/:id", getSingleConsumer);
router.delete("/:id",removeConsumer);

module.exports = router;

