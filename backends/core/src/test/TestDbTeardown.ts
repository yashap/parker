import { Db } from '../db/Db'

// Don't need to explicitly list tables with foreign key ON DELETE CASCADE
const tablesToDestroy = ['ParkingSpot'] as const

export class TestDbTeardown {
  public async clear(): Promise<void> {
    for (const table of tablesToDestroy) {
      await Db.db().execute(`DELETE FROM "${table}"`)
    }
  }
}
