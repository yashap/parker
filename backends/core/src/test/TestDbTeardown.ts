import { BaseRepository } from '../db/BaseRepository'

// Don't need to explicitly list tables with foreign key ON DELETE CASCADE
const tablesToDestroy = ['ParkingSpot'] as const
type TableName = (typeof tablesToDestroy)[number]

export class TestDbTeardown extends BaseRepository {
  public async clear(): Promise<void> {
    for (const table of tablesToDestroy) {
      await this.clearTable(table)
    }
  }

  public async clearTable(table: TableName): Promise<void> {
    await this.db().deleteFrom(table).executeTakeFirst()
  }

  public async disconnect(): Promise<void> {
    await this.db().destroy()
  }
}
