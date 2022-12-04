import { useState } from 'react'
import { CreateParkingSpot } from './screen/CreateParkingSpot'
import { Login } from './screen/Login'

export const App = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />
  }
  return <CreateParkingSpot />
}
