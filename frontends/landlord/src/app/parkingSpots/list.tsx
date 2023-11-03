import React from 'react'
import { FlatList, Text } from 'react-native'
import { ActivityIndicator, useTheme } from 'react-native-paper'
import { useCoreClient } from '../../apiClient/useCoreClient'
import { ScreenContainer } from '../../components/ScreenContainer'
import { showErrorToast } from '../../toasts/showErrorToast'

const ParkingSpotList: React.FC = () => {
  const theme = useTheme()
  const {
    value: parkingSpotsResponse,
    loading,
    error,
  } = useCoreClient((coreClient) =>
    coreClient.parkingSpots.listClosestToPoint({ latitude: 50, longitude: 50, limit: 10 })
  )
  if (loading) {
    // TODO: better size, colors, etc?
    return (
      <ScreenContainer>
        <ActivityIndicator animating={true} color={theme.colors.secondary} size={'large'} />
      </ScreenContainer>
    )
  }
  if (error) {
    showErrorToast(error)
  }

  return (
    <ScreenContainer>
      <FlatList
        data={parkingSpotsResponse?.data ?? []}
        renderItem={({ item: parkingSpot }) => <Text className='text-lg p-2'>{parkingSpot.id}</Text>}
      />
    </ScreenContainer>
  )
}

export default ParkingSpotList
