import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { CoreClientBuilder } from '../apiClient/CoreClientBuilder'
import { AuthenticationStore } from '../store/AuthenticationStore'

const StyledTextInput = (props: TextInputProps) => (
  <TextInput className='text-lg text-gray-700 w-11/12 my-2 p-2 bg-white rounded-md shadow shadow-gray-400' {...props} />
)

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
    <View className='flex-1 bg-green-300 items-center justify-center'>
      <StatusBar style='auto' />
      <Text className='text-5xl text-gray-700 font-bold m-3'>Parker</Text>
      <StyledTextInput
        multiline={true}
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
      <Pressable
        className='w-11/12 bg-blue-600 px-4 py-2 rounded-lg m-2 shadow shadow-blue-400'
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
      >
        <Text className='text-2xl text-white font-bold text-center'>Login</Text>
      </Pressable>
    </View>
  )
}
