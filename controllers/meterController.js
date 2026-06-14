const db = require('../config/db');

exports.getMeters = async (req, res) => {

    try {
        const [result] = await db.query("Select * from meters");
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getMeterWithConsumer = async (req, res) => {
    try {
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

        const [result] = await db.query(sql);
        res.json(result);
    }
    catch (err) {
        res.status(500).json(err);
    }
};

exports.getMeterByConsumer = async (req, res) => {
    try {
        const id = req.params.id;

        const sql = `
    SELECT *
    FROM meters
    WHERE consumer_id=?
    `;

        const [result] = await db.query(sql, [id]);

        res.json(result);
    }
    catch (err) {
        res.status(500).json(err);
    }

};