import { PlaceSuggestionDto } from '@parker/places-client'
import * as Localization from 'expo-localization'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, Keyboard, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { ActivityIndicator, Card, List, Portal, TextInput } from 'react-native-paper'
import { PlacesClientBuilder } from 'src/apiClient/PlacesClientBuilder'
import { useDeviceLocation } from 'src/hooks/useDeviceLocation'
import { showErrorToast } from 'src/toasts/showErrorToast'

const SEARCH_RADIUS_METERS = 100_000

interface AddressAutocompleteProps {
  onAddressSelected: (address: string, location: { latitude: number; longitude: number }) => void
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({ onAddressSelected }) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<PlaceSuggestionDto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [inputLayout, setInputLayout] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // The debounce cancels pending timers but not requests already in flight, so several searches can
  // be racing at once (one per pause while typing). Only the latest may update the dropdown:
  // out-of-order responses would otherwise keep re-rendering the rows under the user's finger, and
  // a tap on a row that's being replaced falls through to the backdrop and just closes the dropdown.
  const searchSequenceRef = useRef(0)
  const inputRef = useRef<View>(null)
  const placesClient = PlacesClientBuilder.build()
  const { location: deviceLocation } = useDeviceLocation()

  const searchPlaces = useCallback(
    async (searchQuery: string) => {
      const sequence = ++searchSequenceRef.current
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
          ...(deviceLocation && {
            latitude: deviceLocation.coords.latitude,
            longitude: deviceLocation.coords.longitude,
            radius: SEARCH_RADIUS_METERS,
            useStrictBounds: true,
          }),
          language: locales[0].languageCode ?? 'en',
          limit: 5,
        })
        if (sequence !== searchSequenceRef.current) {
          return // A newer search has started; discard this stale response
        }
        setSuggestions(response.data)
        setShowSuggestions(true)
      } catch {
        if (sequence === searchSequenceRef.current) {
          setSuggestions([])
        }
      } finally {
        if (sequence === searchSequenceRef.current) {
          setIsLoading(false)
        }
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
      showErrorToast(error, 'Failed to select address')
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
          testID='addressInput'
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
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    testID={`addressSuggestion-${index}`}
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
