import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from './Button'

export default function Native() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Native</Text>
      <Button
        onClick={() => {
          console.log('Pressed it!')
          alert('Pressed it!')
        }}
        text='Press Me!'
      />
      <StatusBar style='auto' />
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
})
