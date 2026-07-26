import { DayOfWeekAllValues, DayOfWeekDto } from '@parker/api-client-utils'
import { TimeRuleDto, TimeRuleOverrideDto } from '@parker/parking-client'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { ActivityIndicator, Button, Card, Divider, List, Text, useTheme } from 'react-native-paper'
import { ParkingClientBuilder } from 'src/apiClient/ParkingClientBuilder'
import { isInstantAfter, isTimeOfDayEndAfterStart } from 'src/components/availability/availabilityTime'
import { OverrideEditorModal } from 'src/components/availability/OverrideEditorModal'
import { OverrideItem } from 'src/components/availability/OverrideItem'
import { QuickOverrideActions } from 'src/components/availability/QuickOverrideActions'
import { TimeRuleItem } from 'src/components/availability/TimeRuleItem'
import { Screen } from 'src/components/Screen'
import { useNavigationHeader } from 'src/hooks/useNavigationHeader'
import { useParkingClient } from 'src/hooks/useParkingClient'
import { showErrorToast } from 'src/toasts/showErrorToast'
import { showToast } from 'src/toasts/showToast'

const RULE_ERROR = 'End time must be after start time'
const OVERRIDE_ERROR = 'End must be after start'

interface EditorState {
  visible: boolean
  /** Index of the override being edited, or `null` when adding a new one. */
  index: number | null
}

const ConfigureAvailability: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const theme = useTheme()
  const [saving, setSaving] = useState(false)
  const [timeRules, setTimeRules] = useState<TimeRuleDto[]>([])
  const [overrides, setOverrides] = useState<TimeRuleOverrideDto[]>([])
  const [initial, setInitial] = useState<{ timeRules: TimeRuleDto[]; overrides: TimeRuleOverrideDto[] }>({
    timeRules: [],
    overrides: [],
  })
  const [editor, setEditor] = useState<EditorState>({ visible: false, index: null })

  useNavigationHeader({ type: 'defaultHeader', title: 'Configure Availability' })

  const {
    value: parkingSpot,
    loading,
    error,
  } = useParkingClient((parkingClient) => parkingClient.parkingSpots.get(id), [id])

  useEffect(() => {
    if (parkingSpot) {
      setTimeRules(parkingSpot.timeRules)
      setOverrides(parkingSpot.timeRuleOverrides)
      setInitial({ timeRules: parkingSpot.timeRules, overrides: parkingSpot.timeRuleOverrides })
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
    if (timeRules.some((rule) => rule.day === day)) {
      showToast({ type: 'default', message: `Rule for ${day} already exists` })
      return
    }
    setTimeRules([...timeRules, { day, startTime: '09:00:00', endTime: '17:00:00' }])
  }

  const updateTimeRule = (index: number, rule: TimeRuleDto) => {
    setTimeRules(timeRules.map((existing, i) => (i === index ? rule : existing)))
  }

  const deleteTimeRule = (index: number) => {
    setTimeRules(timeRules.filter((_, i) => i !== index))
  }

  const addOverride = (override: TimeRuleOverrideDto) => {
    setOverrides([...overrides, override])
  }

  const saveOverride = (override: TimeRuleOverrideDto) => {
    setOverrides(
      editor.index === null
        ? [...overrides, override]
        : overrides.map((existing, i) => (i === editor.index ? override : existing))
    )
    setEditor({ visible: false, index: null })
  }

  const deleteOverride = (index: number) => {
    setOverrides(overrides.filter((_, i) => i !== index))
  }

  const ruleError = (rule: TimeRuleDto): string | undefined =>
    isTimeOfDayEndAfterStart(rule.startTime, rule.endTime) ? undefined : RULE_ERROR
  const overrideError = (override: TimeRuleOverrideDto): string | undefined =>
    isInstantAfter(override.endsAt, override.startsAt) ? undefined : OVERRIDE_ERROR

  const hasInvalid = timeRules.some((rule) => ruleError(rule)) || overrides.some((override) => overrideError(override))
  const hasChanges = JSON.stringify({ timeRules, overrides }) !== JSON.stringify(initial)
  const availableDays = DayOfWeekAllValues.filter((day) => !timeRules.some((rule) => rule.day === day))

  const handleSave = async () => {
    setSaving(true)
    try {
      const parkingClient = ParkingClientBuilder.build()
      await parkingClient.parkingSpots.update(id, { timeRules, timeRuleOverrides: overrides })
      showToast({ type: 'default', message: 'Availability updated successfully' })
      router.back()
    } catch (saveError) {
      showErrorToast(saveError)
    } finally {
      setSaving(false)
    }
  }

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
          Weekly Availability
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
              error={ruleError(rule)}
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

      <Divider style={{ marginVertical: 16 }} />

      <View style={{ marginBottom: 16 }}>
        <Text variant='titleMedium' style={{ marginBottom: 4 }}>
          Overrides
        </Text>
        <Text variant='bodyMedium' style={{ color: theme.colors.onSurfaceVariant, marginBottom: 12 }}>
          One-off changes that take priority over the weekly schedule for a specific date and time range.
        </Text>

        <View style={{ marginBottom: 12 }}>
          <QuickOverrideActions onAdd={addOverride} />
        </View>

        {overrides.length === 0 ? (
          <Card>
            <Card.Content>
              <Text style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>No overrides set.</Text>
            </Card.Content>
          </Card>
        ) : (
          overrides.map((override, index) => (
            <OverrideItem
              key={`${override.startsAt}-${index}`}
              override={override}
              timeZone={parkingSpot.timeZone}
              error={overrideError(override)}
              onEdit={() => {
                setEditor({ visible: true, index })
              }}
              onDelete={() => {
                deleteOverride(index)
              }}
            />
          ))
        )}

        <Button
          mode='outlined'
          icon='plus'
          style={{ marginTop: 8 }}
          onPress={() => {
            setEditor({ visible: true, index: null })
          }}
        >
          Add Override
        </Button>
      </View>

      <View style={{ marginTop: 8, gap: 12 }}>
        <Button
          mode='contained'
          onPress={() => {
            void handleSave()
          }}
          loading={saving}
          disabled={saving || !hasChanges || hasInvalid}
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

      <OverrideEditorModal
        visible={editor.visible}
        timeZone={parkingSpot.timeZone}
        initial={editor.index === null ? null : (overrides[editor.index] ?? null)}
        onDismiss={() => {
          setEditor({ visible: false, index: null })
        }}
        onSave={saveOverride}
      />
    </ScrollView>
  )
}

export default ConfigureAvailability
