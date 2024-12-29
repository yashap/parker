import { router } from 'expo-router'
import { Button } from 'react-native-paper'
import 'react-native-url-polyfill/auto'
import SuperTokens from 'supertokens-react-native'
import { AuthClientBuilder } from 'src/apiClient/AuthClientBuilder'
import { IAuthContext, useAuthContext } from 'src/contexts/AuthContext'
import { useTheme } from 'src/theme'
import { showErrorToast } from 'src/toasts/showErrorToast'

const logout = async (authContext: IAuthContext) => {
  await SuperTokens.signOut()
  try {
    await AuthClientBuilder.build().logOut()
    authContext.setLoggedInUser(undefined)
    router.replace('/logIn')
  } catch (error) {
    showErrorToast(error)
  }
}

export const LogoutButton = () => {
  const theme = useTheme()
  const authContext = useAuthContext()
  return (
    <Button
      mode='text'
      textColor={theme.colors.link}
      onPress={() => {
        void logout(authContext)
      }}
    >
      Logout
    </Button>
  )
}
