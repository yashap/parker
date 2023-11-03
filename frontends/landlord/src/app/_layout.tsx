import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import FlashMessage from 'react-native-flash-message'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import 'react-native-url-polyfill/auto'
import SuperTokens from 'supertokens-react-native'
import ErrorBoundary from '../components/ErrorBoundary'
import { config } from '../config'

SuperTokens.init({
  apiDomain: config.coreUrl,
  apiBasePath: '/auth',
})

const Layout: React.FC = () => (
  <SafeAreaProvider>
    <SafeAreaView edges={['top', 'left', 'right']} className='flex-1  bg-green-200'>
      <StatusBar style='auto' />
      <ErrorBoundary>
        {/* <AuthProvider> */}
        <Stack
          screenOptions={{
            headerBackTitle: '',
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: 'rgb(187 247 208)',
            },
          }}
        >
          {/*
              TODO: would be nicer to put this config in each component, but there's a bug where it generates
              annoying warnings. Move these to the the individual screen components once that's fixed
            */}
          <Stack.Screen name='signUp' options={{ headerShown: false }} />
          <Stack.Screen name='logIn' options={{ headerShown: false }} />
          <Stack.Screen name='parkingSpots/list' options={{ title: 'Your Parking Spots' }} />
          <Stack.Screen name='parkingSpots/new' options={{ title: 'Add Parking Spot' }} />
        </Stack>
        {/* </AuthProvider> */}
      </ErrorBoundary>
      <FlashMessage
        position='bottom'
        animated={true}
        floating={true}
        titleStyle={{ fontSize: 18 }}
        textStyle={{ fontSize: 14 }}
      />
    </SafeAreaView>
  </SafeAreaProvider>
)

export default Layout
