async function calculateEnergyCharge(connectionType, units, db) {

    const [slabs] = await db.execute(
        "SELECT * FROM tariffs WHERE connection_type = ? ORDER BY min_unit ASC",
        [connectionType]
    );

    let remainingUnits = units;
    let total = 0;

    for (let slab of slabs) {

        if (remainingUnits <= 0) break;

        const slabUnits = Math.min(
            remainingUnits,
            slab.max_unit - slab.min_unit + 1
        );

        total += slabUnits * slab.rate_per_unit;
        remainingUnits -= slabUnits;
    }

    return total;
}

module.exports = calculateEnergyCharge;