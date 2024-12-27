import { router } from 'expo-router'
import React from 'react'
import { Linking, View } from 'react-native'
import { Button, Caption, Card, Divider, Headline, Subheading, Text, TextInput } from 'react-native-paper'
import { AuthClientBuilder } from 'src/apiClient/AuthClientBuilder'
import { useNavigationHeader } from 'src/hooks/useNavigationHeader'
import { useTheme } from 'src/theme'
import { showErrorToast } from 'src/toasts/showErrorToast'

export interface SignUpProps {
  email: string
  password: string
  setEmail: (email: string) => void
  setPassword: (password: string) => void
}

const signUp = async ({ email, password }: Pick<SignUpProps, 'email' | 'password'>) => {
  try {
    await AuthClientBuilder.build().signUp({ email, password })
    router.replace('/parkingSpots/list')
  } catch (error) {
    showErrorToast(error)
  }
}

const SignUp: React.FC = () => {
  useNavigationHeader({ type: 'noHeader' })
  const theme = useTheme()
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  return (
    <View>
      <Card className='space-y-3 p-3'>
        {/* Header */}
        <View className='items-center'>
          <Headline>Sign up</Headline>
          <Subheading>
            {'Already have an account? '}
            <Text
              style={{ color: theme.colors.link }}
              onPress={() => {
                router.replace('/logIn')
              }}
            >
              Log in
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
            void signUp({ email, password })
          }}
        >
          Sign up
        </Button>

        {/* Terms and conditions */}
        <Caption className='items-center'>
          By signing up, you agree to our{' '}
          <Text
            style={{ color: theme.colors.link }}
            onPress={() => void Linking.openURL('https://supertokens.com/legal/terms-and-conditions')}
          >
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text
            style={{ color: theme.colors.link }}
            onPress={() => {
              void Linking.openURL('https://supertokens.com/legal/privacy-policy')
            }}
          >
            Privacy Policy
          </Text>
        </Caption>
      </Card>
    </View>
  )
}

export default SignUp
