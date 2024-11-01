import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import FlashMessage from 'react-native-flash-message'
import { PaperProvider } from 'react-native-paper'
import 'react-native-url-polyfill/auto'
import { SafeAreaView } from 'react-native-safe-area-context'
import SuperTokens from 'supertokens-react-native'
import { config } from '../config'
import { lightTheme, useTheme } from '../theme'

SuperTokens.init({
  apiDomain: config.coreUrl,
  apiBasePath: '/auth',
})

const Router = () => {
  const theme = useTheme()
  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background }} className='flex-1'>
      <Stack
        screenOptions={{
          headerBackTitle: '',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTitleStyle: {
            color: theme.colors.onBackground,
          },
        }}
      >
        <Stack.Screen name='signUp' />
        <Stack.Screen name='logIn' />
        <Stack.Screen name='parkingSpots/list' />
        <Stack.Screen name='parkingSpots/new' />
      </Stack>
    </SafeAreaView>
  )
}

// This is essentially the entrypoint for the application
const Layout: React.FC = () => {
  return (
    <PaperProvider theme={lightTheme}>
      <StatusBar style='auto' />
      <Router />
      <FlashMessage
        position='bottom'
        animated={true}
        floating={true}
        titleStyle={{ fontSize: 18 }}
        textStyle={{ fontSize: 14 }}
      />
    </PaperProvider>
  )
}

export default Layout
