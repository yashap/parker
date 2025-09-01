import * as Location from 'expo-location'
import { useEffect, useState } from 'react'

interface UseDeviceLocationReturn {
  location: Location.LocationObject | undefined
  isLoading: boolean
}

export const useDeviceLocation = (): UseDeviceLocationReturn => {
  const [location, setLocation] = useState<Location.LocationObject | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()

        if (status !== Location.PermissionStatus.GRANTED) {
          if (isMounted) {
            setIsLoading(false)
          }
          return
        }

        // Try to get current position first
        try {
          const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          })

          if (isMounted) {
            setLocation(currentLocation)
            setIsLoading(false)
          }
          return
        } catch {
          // Current position failed, try last known position
        }

        // Fallback to last known position
        const lastKnownLocation = await Location.getLastKnownPositionAsync()
        if (isMounted) {
          setLocation(lastKnownLocation ?? undefined)
          setIsLoading(false)
        }
      } catch {
        // Permission request or all location attempts failed
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void getLocation()

    return () => {
      isMounted = false
    }
  }, [])

  return { location, isLoading }
}
