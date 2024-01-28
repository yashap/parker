/* eslint-disable */
exports.up = async (db) => {
  return db
    .runSql(`
      CREATE TABLE IF NOT EXISTS "values_ParkingSpotBooking_status" (
        "status" TEXT NOT NULL PRIMARY KEY
      );
    `)
    .then(() =>
      db.runSql(`
        INSERT INTO "values_ParkingSpotBooking_status" VALUES
          ('Accepted'),
          ('InProgress'),
          ('Cancelled')
        ;
      `)
    )
    .then(() =>
      db.runSql(`
        CREATE TABLE IF NOT EXISTS "ParkingSpotBooking" (
          "id" UUID NOT NULL DEFAULT uuid_generate_v1() PRIMARY KEY,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          "parkingSpotId" UUID NOT NULL REFERENCES "ParkingSpot"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          "bookedByUserId" UUID NOT NULL,
          "bookingStartsAt" TIMESTAMP(3) NOT NULL,
          "bookingEndsAt" TIMESTAMP(3),
          "status" TEXT NOT NULL REFERENCES "values_ParkingSpotBooking_status"("status")
        );
      `)
    )
    .then(() => db.runSql('CREATE INDEX IF NOT EXISTS "ParkingSpotBooking_bookedByUserId_idx" ON "ParkingSpotBooking"("bookedByUserId");'))
    .then(() => db.runSql('CREATE INDEX IF NOT EXISTS "ParkingSpotBooking_parkingSpotId_idx" ON "ParkingSpotBooking"("parkingSpotId");'))
}

exports.down = async () => {
  console.warn("We don't run down migrations")
}
