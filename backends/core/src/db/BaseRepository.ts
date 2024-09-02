import { Kysely, Transaction } from 'kysely'
import { Database } from './Database'
import { DB } from './generated/db'

export abstract class BaseRepository {
  protected db(): Transaction<DB> | Kysely<DB> {
    return Database.getConnection()
  }

  protected runWithTransaction<T>(callback: () => Promise<T>): Promise<T> {
    return Database.runWithTransaction(callback)
  }
}
