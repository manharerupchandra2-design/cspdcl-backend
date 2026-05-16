// const express = require("express");
// const router = express.Router();

// const {
//   addReading,
//   getReadingsByConsumer
// } = require("../controllers/readingController");

// router.post("/", addReading);
// router.get("/:consumerId", getReadingsByConsumer);

// module.exports = router;

const express = require("express");

const router = express.Router();

const {
  addReading
} = require("../controllers/readingController");

router.post("/", addReading);

module.exports = router;