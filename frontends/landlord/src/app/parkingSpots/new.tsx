import { router } from 'expo-router'
import { useState } from 'react'
import { CoreClientBuilder } from '../../apiClient/CoreClientBuilder'
import { ScreenContainer } from '../../components/ScreenContainer'
import { StyledTextInput } from '../../components/StyledTextInput'
import { SubmitButton } from '../../components/SubmitButton'
import { AuthenticationStore } from '../../store/AuthenticationStore'

export default function NewParkingSpot() {
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
          await coreClient.parkingSpots.create({
            location: { latitude: Number(latitude), longitude: Number(longitude) },
            ownerUserId: AuthenticationStore.getAuthenticatedUser().id,
          })
          router.push('/parkingSpots/list')
        }}
      />
    </ScreenContainer>
  )
}
