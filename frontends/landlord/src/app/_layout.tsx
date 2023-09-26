import { Stack } from 'expo-router'
import FlashMessage from 'react-native-flash-message'
import 'react-native-url-polyfill/auto'

export default function Layout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: 'rgb(74 222 128)',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitle: '',
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen name='login' options={{ title: 'Login' }} />
        <Stack.Screen name='parkingSpots/list' options={{ title: 'Your Parking Spots' }} />
        <Stack.Screen name='parkingSpots/new' options={{ title: 'Create Parking Spot' }} />
      </Stack>
      <FlashMessage
        position='bottom'
        animated={true}
        floating={true}
        titleStyle={{ fontSize: 18 }}
        textStyle={{ fontSize: 14 }}
      />
    </>
  )
}
