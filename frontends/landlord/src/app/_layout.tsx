import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import FlashMessage from 'react-native-flash-message'
import { PaperProvider } from 'react-native-paper'
import { en, registerTranslation } from 'react-native-paper-dates'
import 'react-native-url-polyfill/auto'
import { SafeAreaView } from 'react-native-safe-area-context'
import SuperTokens from 'supertokens-react-native'
import { config } from 'src/config'
import { AuthContextProvider } from 'src/contexts/AuthContext'
import 'src/global.css'
import 'src/styles/cssInterop'
import { lightTheme, useTheme } from 'src/theme'

SuperTokens.init({
  apiDomain: config.authUrl,
  apiBasePath: '/auth',
})

// Required by react-native-paper-dates for its date/time picker modals
registerTranslation('en', en)

const Router = () => {
  const theme = useTheme()
  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background }} className='flex-1'>
      <Stack
        screenOptions={{
          headerBackTitle: '',
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
        <Stack.Screen name='parkingSpots/configureAvailability' />
      </Stack>
    </SafeAreaView>
  )
}

// This is essentially the entrypoint for the application
const Layout: React.FC = () => {
  return (
    <AuthContextProvider>
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
    </AuthContextProvider>
  )
}

export default Layout
