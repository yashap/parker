import { router } from 'expo-router'
import React from 'react'
import { Button } from 'react-native-paper'
import 'react-native-url-polyfill/auto'
import SuperTokens from 'supertokens-react-native'
import { AuthClientBuilder } from '../../apiClient/AuthClientBuilder'
import { showErrorToast } from '../../toasts/showErrorToast'

export const LogoutButton = () => (
  <Button
    onPress={async () => {
      await SuperTokens.signOut()
      try {
        await AuthClientBuilder.build().logOut()
        router.replace('/logIn')
      } catch (error) {
        showErrorToast(error)
      }
    }}
  >
    Logout
  </Button>
)
