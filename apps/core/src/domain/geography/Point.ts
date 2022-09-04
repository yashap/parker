export interface Point {
  latitude: number
  longitude: number
}

export type Longitude = number
export type Latitude = number
export interface GeoJsonPoint {
  type: 'Point'
  coordinates: [Longitude, Latitude]
}
