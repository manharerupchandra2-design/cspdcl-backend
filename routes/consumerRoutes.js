const express = require("express");
const router = express.Router();

const {
  addConsumer,
  getAllConsumers,
  getSingleConsumer,
  removeConsumer
} = require("../controllers/consumerController");

router.post("/", addConsumer);
router.get("/", getAllConsumers);
router.get("/:id", getSingleConsumer);
router.delete("/:id",removeConsumer);

module.exports = router;