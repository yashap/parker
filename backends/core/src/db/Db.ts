import { DbConnection, TransactionManager } from '@parker/drizzle-utils'
import { required } from '@parker/errors'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

export type DatabaseSchema = typeof schema

export class Db {
  // Ensure just one DB connection for the app
  private static dbSingleton: NodePgDatabase<DatabaseSchema> = drizzle({
    schema,
    connection: {
      connectionString: required(process.env['DATABASE_URL']),
    },
  })

  private static transactionManager = new TransactionManager<DatabaseSchema>(this.dbSingleton)

  public static db(): DbConnection<DatabaseSchema> {
    return this.transactionManager.getConnection()
  }

  public static runWithTransaction<T>(callback: () => Promise<T>): Promise<T> {
    return this.transactionManager.run(callback)
  }
}
