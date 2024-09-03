import { Generated, Kysely, PostgresDialect, Selectable } from 'kysely'
import { Pool } from 'pg'

export interface Database {
  Person: PersonTable
}

export interface PersonTable {
  id: Generated<number>
  name: string
}

export type Person = Selectable<PersonTable>

export class TestDb {
  private static dbSingleton: Kysely<Database> | undefined = undefined

  public static async init() {
    const dbUrl = process.env['DATABASE_URL']
    if (!dbUrl) {
      throw new Error('DATABASE_URL is not set')
    }
    this.dbSingleton = new Kysely<Database>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: dbUrl,
        }),
      }),
    })
    await this.dbSingleton.schema.dropTable('Person').ifExists().execute()
    await this.dbSingleton.schema
      .createTable('Person')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('name', 'varchar', (col) => col.notNull())
      .execute()
  }

  public static db(): Kysely<Database> {
    const db = this.dbSingleton
    if (!db) {
      throw new Error('TestDB not initialized (must call init before using)')
    }
    return db
  }

  public static async clear(): Promise<void> {
    await this.db().deleteFrom('Person').executeTakeFirst()
  }

  public static async disconnect(): Promise<void> {
    await this.db().destroy()
  }
}
