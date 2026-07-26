import { OrderDirectionValues } from '@parker/pagination'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, View } from 'react-native'
import { ActivityIndicator, Avatar, Button, ButtonProps, Card, Text, useTheme } from 'react-native-paper'
import { ParkingClientBuilder } from 'src/apiClient/ParkingClientBuilder'
import { Screen } from 'src/components/Screen'
import { useAuthContext } from 'src/contexts/AuthContext'
import { useCounter } from 'src/hooks/useCounter'
import { useNavigationHeader } from 'src/hooks/useNavigationHeader'
import { useParkingClient } from 'src/hooks/useParkingClient'
import { showErrorToast } from 'src/toasts/showErrorToast'
import { showToast } from 'src/toasts/showToast'

const ParkingSpotImage = (props: { size: number }) => <Avatar.Icon {...props} icon='camera' />

const AddNewParkingSpot = (props: { size: number }) => <Avatar.Icon {...props} icon='plus' />

type EditParkingSpotButtonProps = Omit<ButtonProps, 'onPress' | 'loading' | 'children'>

const EditParkingSpotButton = (props: EditParkingSpotButtonProps) => (
  <Button
    {...props}
    onPress={() => {
      alert('TODO: implement')
    }}
  >
    Edit
  </Button>
)

type ConfigureAvailabilityButtonProps = Omit<ButtonProps, 'onPress' | 'loading' | 'children'> & {
  parkingSpotId: string
}

const ConfigureAvailabilityButton = ({ parkingSpotId, ...rest }: ConfigureAvailabilityButtonProps) => (
  <Button
    {...rest}
    testID={`configureAvailability-${parkingSpotId}`}
    onPress={() => {
      router.push(`/parkingSpots/configureAvailability?id=${parkingSpotId}`)
    }}
  >
    Configure Availability
  </Button>
)

type DeleteParkingSpotButtonProps = Omit<ButtonProps, 'onPress' | 'loading' | 'children'> & {
  parkingSpotId: string
  onDeleted?: () => void
}

const DeleteParkingSpotButton = ({ parkingSpotId, onDeleted, ...rest }: DeleteParkingSpotButtonProps) => {
  const [deleteInProgress, setDeleteInProgress] = useState(false)
  return (
    <Button
      {...rest}
      testID={`deleteParkingSpot-${parkingSpotId}`}
      onPress={() => {
        const doDelete = async () => {
          setDeleteInProgress(true)
          try {
            await ParkingClientBuilder.build().parkingSpots.delete(parkingSpotId)
            showToast({ type: 'default', message: 'Parking spot deleted' })
          } catch (error) {
            showErrorToast(error)
          } finally {
            setDeleteInProgress(false)
            if (onDeleted) {
              onDeleted()
            }
          }
        }
        void doDelete()
      }}
      loading={deleteInProgress}
    >
      Delete
    </Button>
  )
}

const cardClassName = 'mb-2'

const ParkingSpotList: React.FC = () => {
  useNavigationHeader({ type: 'defaultHeader', title: 'Your Parking Spots' })
  const theme = useTheme()
  const [refreshCount, incrementRefreshCount] = useCounter()
  const authContext = useAuthContext()
  const {
    value: parkingSpots,
    loading,
    error,
  } = useParkingClient(
    (parkingClient) =>
      parkingClient.parkingSpots.listAllPages({
        ownerUserId: authContext.getLoggedInUser().id,
        orderBy: 'createdAt',
        orderDirection: OrderDirectionValues.desc,
      }),
    [refreshCount]
  )
  if (loading) {
    // TODO: better size, colors, etc?
    return (
      <Screen>
        <ActivityIndicator animating={true} color={theme.colors.secondary} size={'large'} />
      </Screen>
    )
  }
  if (error) {
    showErrorToast(error)
  }

  return (
    <View testID='parkingSpotsListScreen' className='flex-1 px-1 pt-2'>
      {/* TODO: make "add spot" prominent if no spots, subtle otherwise? */}
      <Card
        testID='addParkingSpotCard'
        className={cardClassName}
        onPress={() => {
          router.push('/parkingSpots/new')
        }}
      >
        <Card.Title title={'Add a New Spot'} left={AddNewParkingSpot} />
      </Card>
      <FlatList
        data={parkingSpots}
        renderItem={({ item: parkingSpot }) => (
          <Card key={parkingSpot.id} testID={`parkingSpotCard-${parkingSpot.id}`} className={cardClassName}>
            <Card.Title title={parkingSpot.address} left={ParkingSpotImage} />
            <Card.Content>
              <Text variant='bodyMedium'>{`Coordinates: ${parkingSpot.location.longitude}, ${parkingSpot.location.latitude}`}</Text>
            </Card.Content>
            <Card.Actions>
              <ConfigureAvailabilityButton parkingSpotId={parkingSpot.id} />
              <EditParkingSpotButton />
              <DeleteParkingSpotButton parkingSpotId={parkingSpot.id} onDeleted={incrementRefreshCount} />
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  )
}

export default ParkingSpotList
