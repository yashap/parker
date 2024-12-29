import { required } from '@parker/errors'
import { createContext, useContext, ReactNode, useState, useCallback } from 'react'
import { User } from 'src/types/User'

export interface IAuthContext {
  isLoggedIn: boolean

  // Throws if the user is not logged in
  getLoggedInUser: () => User

  setLoggedInUser: (user: User | undefined) => void
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

export const useAuthContext = (): IAuthContext => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

interface Props {
  children: ReactNode
}

export const AuthContextProvider = ({ children }: Props) => {
  const [loggedInUser, setLoggedInUserFunc] = useState<User | undefined>(undefined)
  const getLoggedInUser = useCallback(() => {
    return required(loggedInUser, 'User is not logged in')
  }, [loggedInUser])
  const setLoggedInUser = useCallback((user: User | undefined) => {
    setLoggedInUserFunc(user)
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn: loggedInUser !== undefined, getLoggedInUser, setLoggedInUser }}>
      {children}
    </AuthContext.Provider>
  )
}
