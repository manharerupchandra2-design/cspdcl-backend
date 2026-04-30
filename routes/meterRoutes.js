const express = require("express");
const router = express.Router();

const {
    getMeters, 
    addMeter, 
    updateMeter, 
    deleteMeter,
    getMeterWithConsumer,
    getMeterByConsumer
}=require("../controllers/meterController");

router.get('/',getMeters);
router.post('/',addMeter);
router.patch('/:id',updateMeter);
router.delete('/:id',deleteMeter);
router.get('/consumer', getMeterWithConsumer);
router.get('/consumer/:id', getMeterByConsumer);

module.exports=router;