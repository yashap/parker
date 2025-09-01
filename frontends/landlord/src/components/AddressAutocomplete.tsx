import { PlaceSuggestionDto } from '@parker/places-client'
import * as Localization from 'expo-localization'
import * as Location from 'expo-location'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, Keyboard, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { ActivityIndicator, Card, List, Portal, TextInput } from 'react-native-paper'
import { PlacesClientBuilder } from 'src/apiClient/PlacesClientBuilder'

interface AddressAutocompleteProps {
  onAddressSelected: (address: string, location: { latitude: number; longitude: number }) => void
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({ onAddressSelected }) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<PlaceSuggestionDto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [deviceLocation, setDeviceLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [inputLayout, setInputLayout] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<View>(null)
  const placesClient = PlacesClientBuilder.build()

  // Note: In iOS Simulator, you may see location errors. This is normal.
  // To set a simulated location: Simulator menu > Features > Location > Custom Location

  // Get device location on mount
  useEffect(() => {
    void (async () => {
      try {
        const result = await Location.requestForegroundPermissionsAsync()
        if (result.status === Location.PermissionStatus.GRANTED) {
          try {
            // Try to get current position with a timeout
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            })
            setDeviceLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            })
          } catch {
            // For simulator or when GPS fails, try to get last known location
            try {
              const lastKnown = await Location.getLastKnownPositionAsync()
              if (lastKnown) {
                setDeviceLocation({
                  latitude: lastKnown.coords.latitude,
                  longitude: lastKnown.coords.longitude,
                })
              }
            } catch {
              // Location services not available - this is fine, search will work without location
              console.log('Location services not available. Search will proceed without location context.')
            }
          }
        }
      } catch {
        // Permission request failed - this is fine, search will work without location
        console.log('Location permission not granted. Search will proceed without location context.')
      }
    })()
  }, [])

  const searchPlaces = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setIsLoading(true)
      try {
        const locales = Localization.getLocales()
        const response = await placesClient.placeSuggestions.search({
          search: searchQuery,
          ...(deviceLocation && { location: deviceLocation }),
          language: locales[0]?.languageCode ?? 'en',
          limit: 5,
        })
        setSuggestions(response.data)
        setShowSuggestions(true)
      } catch (error) {
        console.error('Error searching places:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    },
    [deviceLocation, placesClient]
  )

  const handleTextChange = (text: string) => {
    setQuery(text)

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      void searchPlaces(text)
    }, 300)
  }

  const handleSuggestionPress = async (suggestion: PlaceSuggestionDto) => {
    try {
      // Get place details to fetch coordinates
      const placeDetails = await placesClient.placeDetails.get(suggestion.placeId)
      if (placeDetails?.location) {
        const address = suggestion.label
        setQuery(address)
        setShowSuggestions(false)
        setSuggestions([])
        Keyboard.dismiss()
        onAddressSelected(address, {
          latitude: placeDetails.location.latitude,
          longitude: placeDetails.location.longitude,
        })
      }
    } catch (error) {
      console.error('Error fetching place details:', error)
    }
  }

  const measureInput = () => {
    if (inputRef.current) {
      inputRef.current.measureInWindow((x, y, width, height) => {
        setInputLayout({ x, y, width, height })
      })
    }
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return (
    <>
      <View
        ref={inputRef}
        collapsable={false}
        onLayout={() => {
          measureInput()
        }}
      >
        <TextInput
          label='Address'
          value={query}
          onChangeText={handleTextChange}
          onFocus={() => {
            measureInput()
            if (query.length >= 2) {
              setShowSuggestions(true)
            }
          }}
          onBlur={() => {
            // Don't hide immediately to allow tap on suggestion
            // Portal handles the hiding when backdrop is touched
          }}
          mode='outlined'
          right={isLoading ? <TextInput.Icon icon={() => <ActivityIndicator size='small' />} /> : undefined}
        />
      </View>

      <Portal>
        {showSuggestions && suggestions.length > 0 && (
          <>
            {/* Invisible backdrop to capture touches outside dropdown */}
            <TouchableWithoutFeedback
              onPress={() => {
                setShowSuggestions(false)
                Keyboard.dismiss()
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            </TouchableWithoutFeedback>

            {/* Dropdown with suggestions */}
            <Card
              style={{
                position: 'absolute',
                top: inputLayout.y + inputLayout.height + 4,
                left: inputLayout.x,
                width: inputLayout.width,
                maxHeight: 250,
                elevation: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
                backgroundColor: 'white',
              }}
            >
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.placeId}
                keyboardShouldPersistTaps='always'
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      void handleSuggestionPress(item)
                    }}
                    activeOpacity={0.9}
                  >
                    <List.Item
                      title={item.label}
                      description={item.subLabel}
                      left={(props) => <List.Icon {...props} icon='map-marker' />}
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#f0f0f0',
                        backgroundColor: 'white',
                      }}
                    />
                  </TouchableOpacity>
                )}
                style={{ backgroundColor: 'white' }}
              />
            </Card>
          </>
        )}
      </Portal>
    </>
  )
}
