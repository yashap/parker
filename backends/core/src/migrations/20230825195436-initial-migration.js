/* eslint-disable */
exports.up = async (db) => {
  return db
    .runSql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => db.runSql('CREATE EXTENSION IF NOT EXISTS "postgis";'))
    .then(() =>
      db.runSql(`
        CREATE TABLE IF NOT EXISTS "ParkingSpot" (
          "id" UUID NOT NULL DEFAULT uuid_generate_v1() PRIMARY KEY,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          "ownerUserId" UUID NOT NULL,
          "location" GEOMETRY(POINT, 4326) NOT NULL
        );
      `)
    )
    .then(() => db.runSql('CREATE INDEX IF NOT EXISTS "location_idx" ON "ParkingSpot" USING GIST ("location");'))
}

exports.down = async () => {
  console.warn("We don't run down migrations")
}
