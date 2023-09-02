/* eslint-disable */
exports.up = async (db) => {
  return db
    .runSql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => db.runSql('CREATE EXTENSION IF NOT EXISTS "postgis";'))
    .then(() =>
      db.runSql(`
        CREATE TABLE IF NOT EXISTS "User" (
          "id" UUID NOT NULL DEFAULT uuid_generate_v1() PRIMARY KEY,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          "email" TEXT NOT NULL,
          "fullName" TEXT NOT NULL
        );
      `)
    )
    .then(() => db.runSql('CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "User" (LOWER("email"));'))
    .then(() =>
      db.runSql(`
        CREATE TABLE IF NOT EXISTS "ParkingSpot" (
          "id" UUID NOT NULL DEFAULT uuid_generate_v1() PRIMARY KEY,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          "ownerUserId" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
          "location" GEOMETRY(POINT, 4326) NOT NULL
        );
      `)
    )
    .then(() => db.runSql('CREATE INDEX IF NOT EXISTS "location_idx" ON "ParkingSpot" USING GIST ("location");'))
}

exports.down = async () => {
  console.warn("We don't run down migrations")
}
