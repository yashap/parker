import { Session } from '@ory/kratos-client'
import { AxiosError } from 'axios'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { KratosClientBuilder } from '../apiClient/KratosClientBuilder'
import { AuthStore, SessionContext } from './AuthStore'

interface Context {
  session?: Session
  sessionToken?: string
  setSession: (session: SessionContext | undefined) => void
  syncSession: () => Promise<void>
  didFetch: boolean
  isAuthenticated: boolean
}

export const AuthContext: React.Context<Context> = createContext<Context>({
  setSession: () => {},
  syncSession: () => Promise.resolve(),
  didFetch: false,
  isAuthenticated: false,
})

interface AuthContextProps {
  children: ReactNode
}

// Provides methods and data related to auth sessions to React components
export const AuthProvider = ({ children }: AuthContextProps) => {
  const [sessionContext, setSessionContext] = useState<SessionContext | undefined>(undefined)

  // Get the session when loading the app, if we already have a session token in local storage
  useEffect((): void => {
    AuthStore.getAuthenticatedSession().then((maybeSession) => syncSession(maybeSession))
  }, [])

  const syncSession = async (auth: SessionContext | undefined): Promise<void> => {
    if (!auth) {
      return setSession(undefined)
    }
    // Use the session token from the auth session
    const kratos = KratosClientBuilder.build()
    try {
      const { data: session } = await kratos.toSession()
      setSessionContext({ ...auth, session })
    } catch (error) {
      if ((error as AxiosError).response?.status === 401) {
        // The user is no longer logged in (hence 401)
        console.log('Session is not authenticated:', error)
      } else {
        // A network or some other error occurred
        console.error('Failed to sync session', error)
      }
      // Remove the session / log the user out.
      setSessionContext(undefined)
    }
  }

  const setSession = async (session: SessionContext | undefined): Promise<void> => {
    if (!session) {
      await AuthStore.killAuthenticatedSession()
      return setSessionContext(session)
    }
    await AuthStore.setAuthenticatedSession(session)
    syncSession(session)
  }

  if (sessionContext === undefined) {
    return null
  }

  const providedContext: Context = {
    // The session information
    session: sessionContext?.session,
    sessionToken: sessionContext?.session_token,

    // Is true when the user has a session
    isAuthenticated: Boolean(sessionContext?.session_token),

    // Fetches the session from the server
    syncSession: async () => {
      const maybeSession = await AuthStore.getAuthenticatedSession()
      syncSession(maybeSession)
    },

    // Allows to override the session
    setSession,

    // Is true if we have fetched the session.
    didFetch: true,
  }

  return <AuthContext.Provider value={providedContext}>{children}</AuthContext.Provider>
}
