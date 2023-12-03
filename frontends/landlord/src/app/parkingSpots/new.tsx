import { router } from 'expo-router'
import React, { useState } from 'react'
import { CoreClientBuilder } from '../../apiClient/CoreClientBuilder'
import { ScreenContainer } from '../../components/ScreenContainer'
import { StyledTextInput } from '../../components/StyledTextInput'
import { SubmitButton } from '../../components/SubmitButton'
import { showErrorToast } from '../../toasts/showErrorToast'

const NewParkingSpot: React.FC = () => {
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  return (
    <ScreenContainer className='items-center justify-top'>
      <StyledTextInput
        placeholder='Latitude'
        onChangeText={(newLatitude) => setLatitude(newLatitude)}
        defaultValue={latitude}
      />
      <StyledTextInput
        placeholder='Longitude'
        onChangeText={(newLongitude) => setLongitude(newLongitude)}
        defaultValue={longitude}
      />
      {/* TODO: maybe switch to Link component? https://docs.expo.dev/routing/navigating-pages/ */}
      <SubmitButton
        title='Submit'
        className='w-11/12'
        onPress={async () => {
          const coreClient = CoreClientBuilder.build()
          try {
            await coreClient.parkingSpots.create({
              location: { latitude: Number(latitude), longitude: Number(longitude) },
            })
            router.push('/parkingSpots/list')
          } catch (error) {
            showErrorToast(error)
          }
        }}
      />
    </ScreenContainer>
  )
}

export default NewParkingSpot
