import { router } from 'expo-router'
import { useState } from 'react'
import { showMessage } from 'react-native-flash-message'
import { CoreClientBuilder } from '../apiClient/CoreClientBuilder'
import { MainTitle } from '../components/MainTitle'
import { ScreenContainer } from '../components/ScreenContainer'
import { StyledTextInput } from '../components/StyledTextInput'
import { SubmitButton } from '../components/SubmitButton'
import { AuthenticationStore } from '../store/AuthenticationStore'

const userHasParkingSpots = async (): Promise<boolean> => {
  const coreClient = CoreClientBuilder.build()
  const { data } = await coreClient.parkingSpots.listClosestToPoint({
    latitude: 50,
    longitude: 50,
    limit: 1,
  })
  return data.length > 0
}

const onLogin = async () => {
  const hasParkingSpots = await userHasParkingSpots()
  if (hasParkingSpots) {
    router.replace('/parkingSpots/list')
  } else {
    router.replace('/parkingSpots/new')
  }
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <ScreenContainer className='items-center justify-center'>
      <MainTitle>Parker</MainTitle>
      <StyledTextInput
        textContentType='username'
        placeholder='Email'
        onChangeText={(newEmail) => setEmail(newEmail)}
        defaultValue={email}
      />
      <StyledTextInput
        secureTextEntry={true}
        placeholder='Password'
        onChangeText={(newPassword) => setPassword(newPassword)}
        defaultValue={password}
      />
      <SubmitButton
        title='Login'
        className='w-11/12'
        onPress={async () => {
          try {
            await AuthenticationStore.login(email, password)
            await onLogin()
          } catch (error) {
            showMessage({
              message: (error as Error).message ?? 'Failed to log in',
              type: 'danger',
            })
          }
        }}
      />
    </ScreenContainer>
  )
}
