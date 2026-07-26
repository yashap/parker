import { DbConnection, TransactionManager } from '@parker/drizzle-utils'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { config } from 'src/config'
import * as schema from 'src/db/schema'

export type DatabaseSchema = typeof schema

export class Db {
  // Ensure just one DB connection for the app
  private static dbSingleton: NodePgDatabase<DatabaseSchema> = drizzle({
    schema,
    casing: 'camelCase',
    connection: {
      connectionString: config.databaseUrl,
    },
  })

  private static transactionManager = new TransactionManager<DatabaseSchema>(Db.dbSingleton)

  public db(): DbConnection<DatabaseSchema> {
    return Db.transactionManager.getConnection()
  }

  public runWithTransaction<T>(callback: () => Promise<T>): Promise<T> {
    return Db.transactionManager.run(callback)
  }
}
