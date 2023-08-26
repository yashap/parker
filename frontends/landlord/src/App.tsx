import { useState } from 'react'
import { Login } from './screen/Login'
import { ParkingSpotList } from './screen/ParkingSpots/ParkingSpotList'

export const App = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />
  }
  return <ParkingSpotList />
}
