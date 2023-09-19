import { Session as KratosSession } from '@ory/kratos-client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

const userSessionKey = 'userSession'

// The session type
export type SessionContext = {
  // The session token
  session_token: string

  // The session data
  session: KratosSession
}

// Manages storage of user sessions on the local device
export class AuthStore {
  public static async getAuthenticatedSession(): Promise<SessionContext | undefined> {
    const sessionRaw = await (Platform.OS === 'web'
      ? AsyncStorage.getItem(userSessionKey)
      : SecureStore.getItemAsync(userSessionKey))
    return sessionRaw ? JSON.parse(sessionRaw) : undefined
  }

  public static setAuthenticatedSession(session: SessionContext): Promise<void> {
    if (Platform.OS === 'web') {
      return AsyncStorage.setItem(userSessionKey, JSON.stringify(session))
    }
    return SecureStore.setItemAsync(userSessionKey, JSON.stringify(session))
  }

  public static killAuthenticatedSession(): Promise<void> {
    if (Platform.OS === 'web') {
      return AsyncStorage.removeItem(userSessionKey)
    }
    return SecureStore.deleteItemAsync(userSessionKey)
  }
}
