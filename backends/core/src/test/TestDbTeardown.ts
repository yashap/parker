import { BaseRepository } from '../db/BaseRepository'

const tables = ['ParkingSpot'] as const
type TableName = (typeof tables)[number]

export class TestDbTeardown extends BaseRepository {
  public async clear(): Promise<void> {
    for (const table of tables) {
      await this.clearTable(table)
    }
  }

  public async clearTable(table: TableName): Promise<void> {
    await this.db.deleteFrom(table).executeTakeFirst()
  }

  public async disconnect(): Promise<void> {
    await this.db.destroy()
  }
}
