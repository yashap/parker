/* eslint-disable */
exports.up = async (db) => {
  return db.runSql(`ALTER TABLE "ParkingSpot" ADD COLUMN "timeZone" TEXT NOT NULL;`)
}

exports.down = async () => {
  console.warn("We don't run down migrations")
}
