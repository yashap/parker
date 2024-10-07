import { router } from 'expo-router'
import { Button } from 'react-native-paper'
import 'react-native-url-polyfill/auto'
import SuperTokens from 'supertokens-react-native'
import { AuthClientBuilder } from '../../apiClient/AuthClientBuilder'
import { showErrorToast } from '../../toasts/showErrorToast'

export const LogoutButton = () => (
  <Button
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
