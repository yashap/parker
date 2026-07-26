import { DayOfWeekAllValues, DayOfWeekDto } from '@parker/api-client-utils'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import {
  ActivityIndicator,
  Button,
  Card,
  Divider,
  IconButton,
  List,
  Switch,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper'
import { ParkingClientBuilder } from 'src/apiClient/ParkingClientBuilder'
import { Screen } from 'src/components/Screen'
import { useNavigationHeader } from 'src/hooks/useNavigationHeader'
import { useParkingClient } from 'src/hooks/useParkingClient'
import { showErrorToast } from 'src/toasts/showErrorToast'
import { showToast } from 'src/toasts/showToast'

interface TimeRuleFormData {
  day: DayOfWeekDto
  startTime: string
  endTime: string
  enabled: boolean
}

const formatTime = (time: string): string => {
  // Convert HH:MM:SS to HH:MM for display
  return time.substring(0, 5)
}

const parseTime = (time: string): string => {
  // Ensure time is in HH:MM:SS format
  if (time.length === 5) {
    return `${time}:00`
  }
  return time
}

const TimeRuleItem: React.FC<{
  rule: TimeRuleFormData
  onUpdate: (rule: TimeRuleFormData) => void
  onDelete: () => void
}> = ({ rule, onUpdate, onDelete }) => {
  const [startTime, setStartTime] = useState(formatTime(rule.startTime))
  const [endTime, setEndTime] = useState(formatTime(rule.endTime))

  const handleTimeUpdate = (field: 'startTime' | 'endTime', value: string) => {
    // Only allow numbers and colon
    const cleaned = value.replace(/[^\d:]/g, '')

    // Auto-format as HH:MM
    let formatted = cleaned
    if (cleaned.length === 2 && !cleaned.includes(':')) {
      formatted = `${cleaned}:`
    }

    if (field === 'startTime') {
      setStartTime(formatted)
      if (formatted.length === 5) {
        onUpdate({ ...rule, startTime: parseTime(formatted) })
      }
    } else {
      setEndTime(formatted)
      if (formatted.length === 5) {
        onUpdate({ ...rule, endTime: parseTime(formatted) })
      }
    }
  }

  return (
    <Card style={{ marginBottom: 8 }}>
      <Card.Content>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text variant='titleMedium' style={{ flex: 1 }}>
            {rule.day}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TextInput
              mode='outlined'
              value={startTime}
              onChangeText={(text) => {
                handleTimeUpdate('startTime', text)
              }}
              placeholder='09:00'
              style={{ width: 70 }}
              maxLength={5}
              keyboardType='numeric'
              dense
            />
            <Text>to</Text>
            <TextInput
              mode='outlined'
              value={endTime}
              onChangeText={(text) => {
                handleTimeUpdate('endTime', text)
              }}
              placeholder='17:00'
              style={{ width: 70 }}
              maxLength={5}
              keyboardType='numeric'
              dense
            />
            <Switch
              value={rule.enabled}
              onValueChange={(enabled) => {
                onUpdate({ ...rule, enabled })
              }}
            />
            <IconButton icon='delete' size={20} onPress={onDelete} />
          </View>
        </View>
      </Card.Content>
    </Card>
  )
}

const ConfigureAvailability: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const theme = useTheme()
  const [saving, setSaving] = useState(false)
  const [timeRules, setTimeRules] = useState<TimeRuleFormData[]>([])
  const [initialTimeRules, setInitialTimeRules] = useState<TimeRuleFormData[]>([])

  useNavigationHeader({ type: 'defaultHeader', title: 'Configure Availability' })

  const {
    value: parkingSpot,
    loading,
    error,
  } = useParkingClient((parkingClient) => parkingClient.parkingSpots.get(id), [id])

  useEffect(() => {
    if (parkingSpot) {
      const rules = parkingSpot.timeRules.map((rule) => ({
        ...rule,
        enabled: true,
      }))
      setTimeRules(rules)
      setInitialTimeRules(rules)
    }
  }, [parkingSpot])

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator animating={true} color={theme.colors.secondary} size={'large'} />
      </Screen>
    )
  }

  if (error) {
    showErrorToast(error)
    return (
      <Screen>
        <Text>Error loading parking spot</Text>
      </Screen>
    )
  }

  if (!parkingSpot) {
    return (
      <Screen>
        <Text>Parking spot not found</Text>
      </Screen>
    )
  }

  const addTimeRule = (day: DayOfWeekDto) => {
    const existingRule = timeRules.find((r) => r.day === day)
    if (existingRule) {
      showToast({ type: 'default', message: `Rule for ${day} already exists` })
      return
    }

    const newRule: TimeRuleFormData = {
      day,
      startTime: '09:00:00',
      endTime: '17:00:00',
      enabled: true,
    }
    setTimeRules([...timeRules, newRule])
  }

  const updateTimeRule = (index: number, rule: TimeRuleFormData) => {
    const newRules = [...timeRules]
    newRules[index] = rule
    setTimeRules(newRules)
  }

  const deleteTimeRule = (index: number) => {
    setTimeRules(timeRules.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const parkingClient = ParkingClientBuilder.build()

      // Only include enabled rules
      const enabledRules = timeRules
        .filter((rule) => rule.enabled)
        .map(({ day, startTime, endTime }) => ({
          day,
          startTime,
          endTime,
        }))

      await parkingClient.parkingSpots.update(id, {
        timeRules: enabledRules,
      })

      showToast({ type: 'default', message: 'Availability updated successfully' })
      router.back()
    } catch (error) {
      showErrorToast(error)
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = JSON.stringify(timeRules) !== JSON.stringify(initialTimeRules)
  const availableDays = DayOfWeekAllValues.filter((day) => !timeRules.some((rule) => rule.day === day))

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Card style={{ marginBottom: 16 }}>
        <Card.Content>
          <Text variant='titleLarge' style={{ marginBottom: 8 }}>
            {parkingSpot.address}
          </Text>
          <Text variant='bodyMedium' style={{ color: theme.colors.onSurfaceVariant }}>
            Set the days and times when this parking spot is available for booking.
          </Text>
        </Card.Content>
      </Card>

      <View style={{ marginBottom: 16 }}>
        <Text variant='titleMedium' style={{ marginBottom: 12 }}>
          Availability Rules
        </Text>

        {timeRules.length === 0 ? (
          <Card>
            <Card.Content>
              <Text style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                No availability rules set. Add days below to configure when your spot is available.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          timeRules.map((rule, index) => (
            <TimeRuleItem
              key={`${rule.day}-${index}`}
              rule={rule}
              onUpdate={(updated) => {
                updateTimeRule(index, updated)
              }}
              onDelete={() => {
                deleteTimeRule(index)
              }}
            />
          ))
        )}
      </View>

      {availableDays.length > 0 && (
        <>
          <Divider style={{ marginVertical: 16 }} />
          <View>
            <Text variant='titleMedium' style={{ marginBottom: 12 }}>
              Add Day
            </Text>
            <Card>
              <List.Section>
                {availableDays.map((day) => (
                  <List.Item
                    key={day}
                    title={day}
                    onPress={() => {
                      addTimeRule(day)
                    }}
                    left={(props) => <List.Icon {...props} icon='plus' />}
                  />
                ))}
              </List.Section>
            </Card>
          </View>
        </>
      )}

      <View style={{ marginTop: 24, gap: 12 }}>
        <Button
          mode='contained'
          onPress={() => {
            void handleSave()
          }}
          loading={saving}
          disabled={saving || !hasChanges}
        >
          Save Changes
        </Button>
        <Button
          mode='outlined'
          onPress={() => {
            router.back()
          }}
          disabled={saving}
        >
          Cancel
        </Button>
      </View>
    </ScrollView>
  )
}

export default ConfigureAvailability
