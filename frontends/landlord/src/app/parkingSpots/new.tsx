import { router } from 'expo-router'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { Button } from 'react-native-paper'
import { ParkingClientBuilder } from 'src/apiClient/ParkingClientBuilder'
import { AddressAutocomplete } from 'src/components/AddressAutocomplete'
import { useNavigationHeader } from 'src/hooks/useNavigationHeader'
import { showErrorToast } from 'src/toasts/showErrorToast'

interface ParkingSpotData {
  address: string
  location: { latitude: number; longitude: number }
}

const onSubmit = async (data: ParkingSpotData) => {
  const parkingClient = ParkingClientBuilder.build()
  try {
    await parkingClient.parkingSpots.create({
      address: data.address,
      location: data.location,
      // TODO!
      timeRules: [],
      // TODO!
      timeRuleOverrides: [],
    })
    router.push('/parkingSpots/list')
  } catch (error) {
    showErrorToast(error)
  }
}

const NewParkingSpot: React.FC = () => {
  useNavigationHeader({ type: 'defaultHeader', title: 'New Parking Spot' })
  const [parkingSpotData, setParkingSpotData] = useState<ParkingSpotData | null>(null)

  const handleAddressSelected = (address: string, location: { latitude: number; longitude: number }) => {
    setParkingSpotData({ address, location })
  }

  return (
    <View className='flex-1 items-stretch space-y-3 p-3'>
      <AddressAutocomplete onAddressSelected={handleAddressSelected} />
      {parkingSpotData && (
        <View style={{ marginTop: 8, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
          <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Selected location:</Text>
          <Text style={{ fontSize: 14, fontWeight: '500' }}>{parkingSpotData.address}</Text>
          <Text style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            {parkingSpotData.location.latitude.toFixed(6)}, {parkingSpotData.location.longitude.toFixed(6)}
          </Text>
        </View>
      )}
      {/* TODO: maybe switch to Link component? https://docs.expo.dev/routing/navigating-pages/ */}
      <Button
        mode='contained'
        disabled={!parkingSpotData}
        onPress={() => {
          if (parkingSpotData) {
            void onSubmit(parkingSpotData)
          }
        }}
      >
        Submit
      </Button>
    </View>
  )
}

export default NewParkingSpot
