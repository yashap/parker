import { Db } from '../db/Db'
import { parkingSpotTable } from '../db/schema'

// Don't need to explicitly list tables with foreign key ON DELETE CASCADE
const tablesToDestroy = [parkingSpotTable]

export class TestDbTeardown {
  public async clear(): Promise<void> {
    for (const table of tablesToDestroy) {
      await Db.db().delete(table)
    }
  }
}
