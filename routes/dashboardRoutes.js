const express = require("express");
const router = express.Router();

const { getDashboard } = require("../controllers/consumerController");

router.get("/", getDashboard);



module.exports = router;