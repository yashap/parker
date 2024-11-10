/* eslint-disable */
exports.up = async (db) => {
  return db
    .runSql(
      `
        CREATE TABLE IF NOT EXISTS "TimeRuleOverride" (
          "id" UUID NOT NULL DEFAULT uuid_generate_v1() PRIMARY KEY,
          "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL,
          "parkingSpotId" UUID NOT NULL REFERENCES "ParkingSpot"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          "startsAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL,
          "endsAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL,
          "isAvailable" BOOLEAN NOT NULL
        );
      `
    )
    .then(() =>
      db.runSql(
        'CREATE INDEX IF NOT EXISTS "TimeRuleOverride_parkingSpotId_idx" ON "TimeRuleOverride"("parkingSpotId");'
      )
    )
}

exports.down = async () => {
  console.warn("We don't run down migrations")
}
