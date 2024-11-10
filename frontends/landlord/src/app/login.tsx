import { router } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { Button, Card, Divider, Headline, Subheading, Text, TextInput } from 'react-native-paper'
import { AuthClientBuilder } from '../apiClient/AuthClientBuilder'
import { useNavigationHeader } from '../hooks/useNavigationHeader'
import { useTheme } from '../theme'
import { showErrorToast } from '../toasts/showErrorToast'

export interface LogInProps {
  email: string
  password: string
  setEmail: (email: string) => void
  setPassword: (password: string) => void
}

const logIn = async ({ email, password }: Pick<LogInProps, 'email' | 'password'>) => {
  try {
    await AuthClientBuilder.build().logIn({ email, password })
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
            void logIn({ email, password })
          }}
        >
          Log in
        </Button>
      </Card>
    </View>
  )
}

export default LogIn
