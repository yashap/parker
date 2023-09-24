import { useState } from 'react'
import FlashMessage from 'react-native-flash-message'
import { CoreClientBuilder } from './apiClient/CoreClientBuilder'
import { Login } from './screen/Login'
import { NewParkingSpot } from './screen/ParkingSpots/NewParkingSpot'
import { ParkingSpotList } from './screen/ParkingSpots/ParkingSpotList'

// TODO: real router
export enum Route {
  Login = 'login',
  NewParkingSpot = 'newParkingSpot',
  ParkingSpotList = 'parkingSpotList',
}

const AppContent = () => {
  const [route, setRoute] = useState<Route>(Route.Login)
  switch (route) {
    case Route.Login:
      return (
        <Login
          onLogin={async () => {
            const coreClient = CoreClientBuilder.build()
            const { data } = await coreClient.parkingSpots.listClosestToPoint({
              latitude: 50,
              longitude: 50,
              limit: 10,
            })
            if (data.length > 0) {
              setRoute(Route.ParkingSpotList)
            } else {
              setRoute(Route.NewParkingSpot)
            }
          }}
        />
      )
    case Route.NewParkingSpot:
      return <NewParkingSpot onCreate={() => setRoute(Route.ParkingSpotList)} />
    case Route.ParkingSpotList:
      return <ParkingSpotList />
  }
}

export const App = () => (
  <>
    <AppContent />
    <FlashMessage position='top' />
  </>
)
