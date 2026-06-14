const express = require("express");
const router = express.Router();

const {
   
    getMeterWithConsumer,
    getMeterByConsumer
}=require("../controllers/meterController");

router.get('/consumer', getMeterWithConsumer);
router.get('/consumer/:id', getMeterByConsumer);

module.exports=router;