import { Point } from '@parker/geography'

export type Longitude = number
export type Latitude = number

export interface GeoJsonPoint {
  type: 'Point'
  coordinates: [Longitude, Latitude]
}

export const toPoint = (geoJsonPoint: GeoJsonPoint): Point => {
  const [longitude, latitude] = geoJsonPoint.coordinates
  return { longitude, latitude }
}
