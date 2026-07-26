import { DbConnection, TransactionManager } from '@parker/drizzle-utils'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { config } from '../config.js'
import * as schema from './schema.js'

export type DatabaseSchema = typeof schema

export class Db {
  // Ensure just one DB connection pool for the app
  private static pool: Pool = new Pool({
    connectionString: config.databaseUrl,
  })

  private static dbSingleton: NodePgDatabase<DatabaseSchema> = drizzle(Db.pool, {
    schema,
    casing: 'camelCase',
  })

  private static transactionManager = new TransactionManager<DatabaseSchema>(Db.dbSingleton)

  public db(): DbConnection<DatabaseSchema> {
    return Db.transactionManager.getConnection()
  }

  public runWithTransaction<T>(callback: () => Promise<T>): Promise<T> {
    return Db.transactionManager.run(callback)
  }

  /**
   * Ends the underlying connection pool - nothing can use the DB after this is called. Intended for tests, which must
   * close the pool for the test process to exit cleanly.
   */
  public static async close(): Promise<void> {
    await Db.pool.end()
  }
}
