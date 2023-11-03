import { router } from 'expo-router'
import * as React from 'react'
import { Linking, StyleSheet, View } from 'react-native'
import { Button, Caption, Card, Divider, Headline, Subheading, Text, TextInput } from 'react-native-paper'
import { AuthClientBuilder } from '../../apiClient/AuthClientBuilder'
import { showErrorToast } from '../../toasts/showErrorToast'

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  urlText: {
    color: 'blue',
  },
  textContainer: {
    alignItems: 'center',
    textAlign: 'center',
  },
  divider: {
    margin: 12,
  },
  input: {
    marginVertical: 12,
  },
})

export interface LogInProps {
  email: string
  password: string
  setEmail: (email: string) => void
  setPassword: (password: string) => void
}

const logIn = async ({ email, password }: Pick<LogInProps, 'email' | 'password'>) => {
  try {
    await AuthClientBuilder.build().logIn({ email, password })
    router.replace('/parkingSpots/new')
  } catch (error) {
    showErrorToast(error)
  }
}

export const LogIn: React.FC<LogInProps> = ({ email, password, setEmail, setPassword }) => (
  <Card style={styles.card}>
    <View style={styles.textContainer}>
      <Headline>Log in</Headline>
      <Subheading>
        {"Don't have an account? "}
        <Text style={styles.urlText} onPress={() => router.replace('/signUp')}>
          Sign up
        </Text>
      </Subheading>
    </View>
    <Divider style={styles.divider} />
    <TextInput style={styles.input} label='Email Address' value={email} onChangeText={setEmail} />
    <TextInput style={styles.input} label='Password' secureTextEntry value={password} onChangeText={setPassword} />
    <Button
      mode='contained'
      color='#ff9933'
      onPress={() => {
        void logIn({ email, password })
      }}
    >
      Log in
    </Button>
    <View style={styles.textContainer}>
      <Caption>
        By signing up, you agree to our{' '}
        <Text
          style={styles.urlText}
          onPress={() => Linking.openURL('https://supertokens.com/legal/terms-and-conditions')}
        >
          Terms of Service
        </Text>{' '}
        and{' '}
        <Text
          style={styles.urlText}
          onPress={() => {
            Linking.openURL('https://supertokens.com/legal/privacy-policy')
          }}
        >
          Privacy Policy
        </Text>
      </Caption>
    </View>
  </Card>
)
