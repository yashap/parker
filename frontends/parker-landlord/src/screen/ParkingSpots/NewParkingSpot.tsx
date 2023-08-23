import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { Button, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native'
import { CoreClientBuilder } from '../../apiClient/CoreClientBuilder'
import { AuthenticationStore } from '../../store/AuthenticationStore'

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

export const NewParkingSpot = () => {
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='auto' />
      <Text style={styles.header}>List Your Parking Spot</Text>
      <TextInput
        style={styles.textInput}
        placeholder='Latitude'
        onChangeText={(newLatitude) => setLatitude(newLatitude)}
        defaultValue={latitude}
      />
      <TextInput
        style={styles.textInput}
        placeholder='Longitude'
        onChangeText={(newLongitude) => setLongitude(newLongitude)}
        defaultValue={longitude}
      />
      <Button
        title='Submit'
        onPress={async () => {
          const coreClient = CoreClientBuilder.build()
          const parkingSpot = await coreClient.createParkingSpot({
            location: { latitude: Number(latitude), longitude: Number(longitude) },
            ownerUserId: AuthenticationStore.getAuthenticatedUser().id,
          })
          alert(`Parking spot created: ${JSON.stringify(parkingSpot)}`)
        }}
      />
    </SafeAreaView>
  )
}
