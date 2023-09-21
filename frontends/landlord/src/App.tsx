import { useState } from 'react'
import FlashMessage from 'react-native-flash-message'
import { Login } from './screen/Login'
import { ParkingSpotList } from './screen/ParkingSpots/ParkingSpotList'

const AppContent = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />
  }
  return <ParkingSpotList />
}

export const App = () => (
  <>
    <AppContent />
    <FlashMessage position='top' />
  </>
)
