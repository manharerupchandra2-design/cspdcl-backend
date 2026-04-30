const db=require('../config/db');

exports.getMeters = async (req,res)=>{
    
    try{
        const [result]=await db.query("Select * from meters");
        res.json(result);
    }catch(err)
    {
        res.status(500).json(err);
    }
};

exports.addMeter =async (req,res)=>{
try{
    const {consumer_id,meter_no,meter_type,installed_date,status} = req.body;

    const sql = "INSERT INTO meters(consumer_id,meter_no,meter_type,installed_date,status) VALUES(?,?,?,?,?)";

    await db.query(sql,[consumer_id,meter_no,meter_type,installed_date,status]);
   
            res.json({message:"Meter Added"});
        }

    catch(err){
             res.status(500).json(err);
    }

};

exports.updateMeter =async (req,res)=>{
try{
    const id = req.params.id;
    const {status} = req.body;

   await db.query("UPDATE meters SET status=? WHERE id=?",[status,id])

       
       
            res.json({message:"Meter Updated"});
        }
 catch(err){
            res.status(500).json(err);
        }
  

};

exports.deleteMeter = async (req,res)=>{

    try{
        const id = req.params.id;

        await db.query("DELETE FROM meters WHERE id=?",[id]);

            res.json({message:"Meter Deleted"});
        }
    catch(err){
        res.status(500).json(err);
    }



};



exports.getMeterWithConsumer = async (req,res)=>{
try{
    const sql = `
    SELECT 
    consumers.id,
    consumers.name,
    consumers.address,
    meters.meter_no,
    meters.meter_type,
    meters.status
    FROM meters
    JOIN consumers 
    ON meters.consumer_id = consumers.id
    `;

    const [result]=await db.query(sql);

       
        
            res.json(result);
    }
        catch(err){
            res.status(500).json(err);
        }

    

};

exports.getMeterByConsumer = async(req,res)=>{
try{
    const id = req.params.id;

    const sql = `
    SELECT *
    FROM meters
    WHERE consumer_id=?
    `;

  const [result]= await  db.query(sql,[id]);
       
       
            res.json(result);
        }

 catch(err){
            res.status(500).json(err);
        }

};