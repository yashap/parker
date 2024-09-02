import { Point } from '@parker/geography'
import { RawBuilder, sql } from 'kysely'
import { omit } from 'lodash'

export class QueryUtils {
  // Returns SQL for creating a Postgres POINT value, from a Point
  public static pointToSql<T = string>(point: Point): RawBuilder<T> {
    const { longitude, latitude } = point
    return sql<T>`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`
  }

  // Returns SQL for selecting a Postgres POINT column, formatting it as GeoJSON text
  public static pointFieldToGeoJson<T = string>(fieldName: string): RawBuilder<T> {
    return sql<T>`ST_AsGeoJSON(${sql.ref(fieldName)})::JSONB::TEXT`
  }

  public static updatedAt(): { updatedAt: string } {
    return {
      // TODO: maybe sql NOW()
      updatedAt: new Date().toISOString(),
    }
  }

  public static withoutSystemTimestamps<T extends { createdAt: string | Date; updatedAt: string | Date }>(
    entity: T
  ): Omit<T, 'createdAt' | 'updatedAt'> {
    return omit(entity)
  }
}
