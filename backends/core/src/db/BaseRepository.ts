import { Kysely, Transaction } from 'kysely'
import { DB } from './generated/db'
import { KyselyDatabase } from './KyselyDatabase'

export abstract class BaseRepository {
  protected legacyDb(): Transaction<DB> | Kysely<DB> {
    return KyselyDatabase.getConnection()
  }

  protected legacyWithTransaction<T>(callback: () => Promise<T>): Promise<T> {
    return KyselyDatabase.runWithTransaction(callback)
  }
}
