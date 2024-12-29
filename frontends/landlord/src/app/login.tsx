import { router } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { Button, Card, Divider, Headline, Subheading, Text, TextInput } from 'react-native-paper'
import { AuthClientBuilder } from 'src/apiClient/AuthClientBuilder'
import { IAuthContext, useAuthContext } from 'src/contexts/AuthContext'
import { useNavigationHeader } from 'src/hooks/useNavigationHeader'
import { useTheme } from 'src/theme'
import { showErrorToast } from 'src/toasts/showErrorToast'

export interface LogInProps {
  email: string
  password: string
  setEmail: (email: string) => void
  setPassword: (password: string) => void
}

const logIn = async ({ email, password }: Pick<LogInProps, 'email' | 'password'>, authContext: IAuthContext) => {
  try {
    const user = await AuthClientBuilder.build().logIn({ email, password })
    authContext.setLoggedInUser(user)
    router.replace('/parkingSpots/list')
  } catch (error) {
    showErrorToast(error)
  }
}

const LogIn: React.FC = () => {
  useNavigationHeader({ type: 'noHeader' })
  const theme = useTheme()
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const authContext = useAuthContext()
  return (
    <View>
      <Card className='space-y-3 p-3'>
        {/* Header */}
        <View className='items-center'>
          <Headline>Log in</Headline>
          <Subheading>
            {"Don't have an account? "}
            <Text
              style={{ color: theme.colors.link }}
              onPress={() => {
                router.replace('/signUp')
              }}
            >
              Sign up
            </Text>
          </Subheading>
        </View>

        <Divider />

        {/* Form inputs */}
        <TextInput label='Email Address' value={email} onChangeText={setEmail} />
        <TextInput label='Password' secureTextEntry value={password} onChangeText={setPassword} />

        {/* Submit */}
        <Button
          mode='contained'
          onPress={() => {
            void logIn({ email, password }, authContext)
          }}
        >
          Log in
        </Button>
      </Card>
    </View>
  )
}

export default LogIn
