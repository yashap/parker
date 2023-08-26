import { ParkingSpotDto } from '@parker/core-client'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { View, FlatList, SafeAreaView, StyleSheet, Text } from 'react-native'
import { CoreClientBuilder } from '../../apiClient/CoreClientBuilder'

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
  listContainer: {
    flex: 1,
    width: '100%',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})

export const ParkingSpotList = () => {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpotDto[]>([])
  useEffect(() => {
    const fetchAndSet = async () => {
      const coreClient = CoreClientBuilder.build()
      const { data } = await coreClient.parkingSpots.listClosestToPoint({ latitude: 50, longitude: 50, limit: 10 })
      setParkingSpots(data)
    }
    // TODO: error toast or something
    fetchAndSet().catch((error) => console.error(error))
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='auto' />
      <Text style={styles.header}>Your Parking Spots</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={parkingSpots}
          renderItem={({ item: parkingSpot }) => <Text style={styles.item}>{parkingSpot.id}</Text>}
        />
      </View>
    </SafeAreaView>
  )
}
