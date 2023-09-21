import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { AuthenticationStore } from '../store/AuthenticationStore'

export interface LoginProps {
  onLogin: () => void
}

export const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <Text style={styles.header}>Login</Text>
      <TextInput
        style={styles.textInput}
        placeholder='Email'
        onChangeText={(newEmail) => setEmail(newEmail)}
        defaultValue={email}
      />
      <TextInput
        style={styles.textInput}
        secureTextEntry={true}
        placeholder='Password'
        onChangeText={(newPassword) => setPassword(newPassword)}
        defaultValue={password}
      />
      <Button
        title='Submit'
        onPress={async () => {
          try {
            await AuthenticationStore.login(email, password)
            onLogin()
          } catch (error) {
            showMessage({
              message: (error as Error).message ?? 'Failed to log in',
              type: 'danger',
            })
          }
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontWeight: 'bold',
    marginBottom: 20,
    fontSize: 36,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'silver',
    padding: 8,
    marginTop: 8,
    marginBottom: 8,
    width: '95%',
  },
})
