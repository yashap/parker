/* eslint-disable */
exports.up = async (db) => {
  return db
    .runSql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => db.runSql('CREATE EXTENSION IF NOT EXISTS "postgis";'))
    .then(() =>
      db.runSql(`
        CREATE TABLE IF NOT EXISTS "ParkingSpot" (
          "id" UUID NOT NULL DEFAULT uuid_generate_v1() PRIMARY KEY,
          "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL,
          "ownerUserId" UUID NOT NULL,
          "location" GEOMETRY(POINT, 4326) NOT NULL
        );
      `)
    )
    .then(() => db.runSql('CREATE INDEX IF NOT EXISTS "ParkingSpot_ownerUserId_idx" ON "ParkingSpot"("ownerUserId");'))
    .then(() =>
      db.runSql('CREATE INDEX IF NOT EXISTS "ParkingSpot_location_idx" ON "ParkingSpot" USING GIST("location");')
    )
    .then(() =>
      db.runSql(`
        CREATE TABLE IF NOT EXISTS "values_TimeRule_day" (
          "day" TEXT NOT NULL PRIMARY KEY
        );
      `)
    )
    .then(() =>
      db.runSql(`
        INSERT INTO "values_TimeRule_day" VALUES
          ('Monday'),
          ('Tuesday'),
          ('Wednesday'),
          ('Thursday'),
          ('Friday'),
          ('Saturday'),
          ('Sunday')
        ;
      `)
    )
    .then(() =>
      db.runSql(`
        CREATE TABLE IF NOT EXISTS "TimeRule" (
          "id" UUID NOT NULL DEFAULT uuid_generate_v1() PRIMARY KEY,
          "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL,
          "parkingSpotId" UUID NOT NULL REFERENCES "ParkingSpot"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          "day" TEXT NOT NULL REFERENCES "values_TimeRule_day"("day"),
          "startTime" TIME WITHOUT TIME ZONE NOT NULL,
          "endTime" TIME WITHOUT TIME ZONE NOT NULL
        );
      `)
    )
    .then(() => db.runSql('CREATE INDEX IF NOT EXISTS "TimeRule_parkingSpotId_idx" ON "TimeRule"("parkingSpotId");'))
}

exports.down = async () => {
  console.warn("We don't run down migrations")
}
