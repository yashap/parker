import { BaseRepository } from '../db/BaseRepository'

const tables = ['ParkingSpot', 'User'] as const

export class TestDbTeardown extends BaseRepository {
  public async clear(): Promise<void> {
    for (const table of tables) {
      await this.db.deleteFrom(table).executeTakeFirst()
    }
  }

  public async disconnect(): Promise<void> {
    await this.db.destroy()
  }
}
