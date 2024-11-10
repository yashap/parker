import { router } from 'expo-router'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { CoreClientBuilder } from '../../apiClient/CoreClientBuilder'
import { useNavigationHeader } from '../../hooks/useNavigationHeader'
import { showErrorToast } from '../../toasts/showErrorToast'

const onSubmit = async ({ address, latitude, longitude }: { address: string; latitude: string; longitude: string }) => {
  const coreClient = CoreClientBuilder.build()
  try {
    await coreClient.parkingSpots.create({
      address,
      location: { latitude: Number(latitude), longitude: Number(longitude) },
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
  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  return (
    <View className='items-stretch space-y-3 p-3'>
      <TextInput label='Address' value={address} onChangeText={setAddress} />
      <TextInput label='Latitude' value={latitude} onChangeText={setLatitude} />
      <TextInput label='Longitude' value={longitude} onChangeText={setLongitude} />
      {/* TODO: maybe switch to Link component? https://docs.expo.dev/routing/navigating-pages/ */}
      <Button
        mode='contained'
        onPress={() => {
          void onSubmit({ address, latitude, longitude })
        }}
      >
        Submit
      </Button>
    </View>
  )
}

export default NewParkingSpot
