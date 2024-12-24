import { Injectable } from '@nestjs/common'
import { DbConnection, TransactionManager } from '@parker/drizzle-utils'
import { required } from '@parker/errors'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

export type DatabaseSchema = typeof schema

@Injectable()
export class Db {
  // Ensure just one DB connection for the app
  private static dbSingleton: NodePgDatabase<DatabaseSchema> = drizzle({
    schema,
    casing: 'camelCase',
    connection: {
      connectionString: required(process.env['DATABASE_URL']),
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
