import { Point } from '@parker/geography'
import { Kysely, PostgresDialect, RawBuilder, sql } from 'kysely'
import { Pool } from 'pg'
import { DB } from './generated/db'

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

  // Returns SQL for creating a Postgres POINT value, from a Parker Point
  protected pointToSql<T = string>(point: Point): RawBuilder<T> {
    const { longitude, latitude } = point
    return sql<T>`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`
  }

  // Returns SQL for selecting a Postgres POINT column, formatting it as GeoJSON text
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
