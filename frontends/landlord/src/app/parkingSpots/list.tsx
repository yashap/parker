import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { ActivityIndicator, useTheme } from 'react-native-paper'
import { useCoreClient } from '../../apiClient/useCoreClient'
import { Screen } from '../../components/Screen'
import { useNavigationHeader } from '../../hooks/useNavigationHeader'
import { showErrorToast } from '../../toasts/showErrorToast'

const ParkingSpotList: React.FC = () => {
  useNavigationHeader({ type: 'defaultHeader', title: 'Your Parking Spots' })
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
      <Screen>
        <ActivityIndicator animating={true} color={theme.colors.secondary} size={'large'} />
      </Screen>
    )
  }
  if (error) {
    showErrorToast(error)
  }

  return (
    <View className='pt-3'>
      <FlatList
        data={parkingSpotsResponse?.data ?? []}
        renderItem={({ item: parkingSpot }) => <Text className='text-lg p-2'>{parkingSpot.id}</Text>}
      />
    </View>
  )
}

export default ParkingSpotList
