import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'

export const CreateParkingSpotScreen = () => {
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  return (
    <View style={styles.container}>
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
      <Button title='Submit' onPress={() => alert(`Lat: ${latitude} ; Long: ${longitude}`)} />
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
