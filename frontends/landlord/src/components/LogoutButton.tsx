import { router } from 'expo-router'
import { Button } from 'react-native-paper'
import 'react-native-url-polyfill/auto'
import SuperTokens from 'supertokens-react-native'
import { AuthClientBuilder } from '../apiClient/AuthClientBuilder'
import { useTheme } from '../theme'
import { showErrorToast } from '../toasts/showErrorToast'

const logout = async () => {
  await SuperTokens.signOut()
  try {
    await AuthClientBuilder.build().logOut()
    router.replace('/logIn')
  } catch (error) {
    showErrorToast(error)
  }
}

export const LogoutButton = () => {
  const theme = useTheme()
  return (
    <Button
      mode='text'
      textColor={theme.colors.link}
      onPress={() => {
        void logout()
      }}
    >
      Logout
    </Button>
  )
}
