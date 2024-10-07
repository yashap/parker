import { required } from '@parker/errors'
import { TransactionManager } from '@parker/kysely-utils'
import { Kysely, PostgresDialect, Transaction } from 'kysely'
import { Pool } from 'pg'
import { DB } from './generated/db'

export class Database {
  // Ensure just one DB connection for the app
  private static dbSingleton: Kysely<DB> = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: required(process.env['DATABASE_URL']),
      }),
    }),
  })

  private static transactionManager = new TransactionManager<DB>(Database.dbSingleton)

  public static getConnection(): Transaction<DB> | Kysely<DB> {
    return this.transactionManager.getConnection()
  }

  public static runWithTransaction<T>(callback: () => Promise<T>): Promise<T> {
    return this.transactionManager.run(callback)
  }
}
