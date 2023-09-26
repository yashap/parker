import { ParkingSpotDto } from '@parker/core-client'
import React, { useEffect, useState } from 'react'
import { FlatList, Text } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { CoreClientBuilder } from '../../apiClient/CoreClientBuilder'
import { ScreenContainer } from '../../components/ScreenContainer'

export default function ParkingSpotList() {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpotDto[]>([])
  // TODO: better way to handle this - hook with loading and whatnot
  useEffect(() => {
    const fetchAndSet = async () => {
      const coreClient = CoreClientBuilder.build()
      const { data } = await coreClient.parkingSpots.listClosestToPoint({ latitude: 50, longitude: 50, limit: 10 })
      setParkingSpots(data)
    }
    fetchAndSet().catch((error) => {
      showMessage({
        message: (error as Error).message ?? 'Failed to fetch parking spots',
        type: 'danger',
      })
    })
  }, [])
  return (
    <ScreenContainer>
      <FlatList
        data={parkingSpots}
        renderItem={({ item: parkingSpot }) => <Text className='text-lg p-2'>{parkingSpot.id}</Text>}
      />
    </ScreenContainer>
  )
}
