import { Point } from '@parker/geography'
import { Kysely, PostgresDialect, RawBuilder, sql } from 'kysely'
import { DB } from 'kysely-codegen'
import { Pool } from 'pg'

export abstract class BaseRepository {
  // Ensure just one DB connection for the app
  private static dbSingleton: Kysely<DB> = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env['DATABASE_URL'],
      }),
    }),
  })

  // But still allow convenient access via this.db
  protected db: Kysely<DB> = BaseRepository.dbSingleton

  protected pointToSql<T = string>(point: Point): RawBuilder<T> {
    const { longitude, latitude } = point
    return sql<T>`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`
  }

  protected pointFieldToGeoJson<T = string>(fieldName: string): RawBuilder<T> {
    return sql<T>`ST_AsGeoJSON(${sql.ref(fieldName)})::JSONB::TEXT`
  }

  protected updatedAt(): { updatedAt: string } {
    return {
      // TODO: maybe sql NOW()
      updatedAt: new Date().toISOString(),
    }
  }
}
