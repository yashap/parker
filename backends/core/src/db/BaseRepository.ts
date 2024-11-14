import { Kysely, Transaction } from 'kysely'
import { DB } from './generated/db'
import { KyselyDatabase } from './KyselyDatabase'

export abstract class BaseRepository {
  protected db(): Transaction<DB> | Kysely<DB> {
    return KyselyDatabase.getConnection()
  }

  protected runWithTransaction<T>(callback: () => Promise<T>): Promise<T> {
    return KyselyDatabase.runWithTransaction(callback)
  }
}
