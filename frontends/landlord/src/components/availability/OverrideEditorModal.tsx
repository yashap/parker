import { TimeRuleOverrideDto } from '@parker/parking-client'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Button, HelperText, Modal, Portal, SegmentedButtons, Text, useTheme } from 'react-native-paper'
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates'
import {
  formatClockTime,
  formatWallClockDate,
  instantPlusHours,
  instantToWallClockParts,
  isInstantAfter,
  nowInstant,
  wallClockToInstant,
  WallClockParts,
} from 'src/components/availability/availabilityTime'

type ActivePicker = 'startDate' | 'startTime' | 'endDate' | 'endTime' | null

interface OverrideEditorModalProps {
  visible: boolean
  timeZone: string
  /** The override being edited, or `null` when adding a new one. */
  initial: TimeRuleOverrideDto | null
  onDismiss: () => void
  onSave: (override: TimeRuleOverrideDto) => void
}

const withParts = (parts: WallClockParts, overrides: Partial<WallClockParts>): WallClockParts => ({
  ...parts,
  ...overrides,
})

export const OverrideEditorModal: React.FC<OverrideEditorModalProps> = ({
  visible,
  timeZone,
  initial,
  onDismiss,
  onSave,
}) => {
  const theme = useTheme()
  const [isAvailable, setIsAvailable] = useState(true)
  const [start, setStart] = useState<WallClockParts>(() => instantToWallClockParts(nowInstant(), timeZone))
  const [end, setEnd] = useState<WallClockParts>(() =>
    instantToWallClockParts(instantPlusHours(nowInstant(), 1), timeZone)
  )
  const [activePicker, setActivePicker] = useState<ActivePicker>(null)

  // Re-seed the form each time the modal opens, from the override being edited or sensible defaults.
  useEffect(() => {
    if (!visible) {
      return
    }
    const now = nowInstant()
    setIsAvailable(initial ? initial.isAvailable : true)
    setStart(instantToWallClockParts(initial ? initial.startsAt : now, timeZone))
    setEnd(instantToWallClockParts(initial ? initial.endsAt : instantPlusHours(now, 1), timeZone))
    setActivePicker(null)
  }, [visible, initial, timeZone])

  const startsAt = wallClockToInstant(start, timeZone)
  const endsAt = wallClockToInstant(end, timeZone)
  const isValid = isInstantAfter(endsAt, startsAt)

  const handleSave = () => {
    if (!isValid) {
      return
    }
    onSave({ startsAt, endsAt, isAvailable })
  }

  const renderRange = (label: string, parts: WallClockParts, dateKey: ActivePicker, timeKey: ActivePicker) => (
    <View style={{ marginBottom: 12 }}>
      <Text variant='labelLarge' style={{ marginBottom: 4 }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button
          mode='outlined'
          style={{ flex: 2 }}
          onPress={() => {
            setActivePicker(dateKey)
          }}
        >
          {formatWallClockDate(parts.date)}
        </Button>
        <Button
          mode='outlined'
          style={{ flex: 1 }}
          onPress={() => {
            setActivePicker(timeKey)
          }}
        >
          {formatClockTime(parts.hours, parts.minutes)}
        </Button>
      </View>
    </View>
  )

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: theme.colors.background,
          margin: 20,
          padding: 20,
          borderRadius: 12,
        }}
      >
        <Text variant='titleLarge' style={{ marginBottom: 16 }}>
          {initial ? 'Edit Override' : 'Add Override'}
        </Text>

        <SegmentedButtons
          value={isAvailable ? 'available' : 'blocked'}
          onValueChange={(value) => {
            setIsAvailable(value === 'available')
          }}
          buttons={[
            { value: 'available', label: 'Available', icon: 'check-circle' },
            { value: 'blocked', label: 'Blocked', icon: 'cancel' },
          ]}
          style={{ marginBottom: 16 }}
        />

        {renderRange('Starts', start, 'startDate', 'startTime')}
        {renderRange('Ends', end, 'endDate', 'endTime')}

        {!isValid ? (
          <HelperText type='error' visible={true}>
            End must be after start
          </HelperText>
        ) : null}

        <Text variant='bodySmall' style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
          Times are in the parking spot&apos;s timezone ({timeZone}).
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <Button mode='outlined' onPress={onDismiss}>
            Cancel
          </Button>
          <Button mode='contained' onPress={handleSave} disabled={!isValid}>
            Save
          </Button>
        </View>
      </Modal>

      <DatePickerModal
        locale='en'
        mode='single'
        visible={activePicker === 'startDate'}
        date={start.date}
        onDismiss={() => {
          setActivePicker(null)
        }}
        onConfirm={({ date }) => {
          if (date) {
            setStart(withParts(start, { date }))
          }
          setActivePicker(null)
        }}
      />
      <DatePickerModal
        locale='en'
        mode='single'
        visible={activePicker === 'endDate'}
        date={end.date}
        onDismiss={() => {
          setActivePicker(null)
        }}
        onConfirm={({ date }) => {
          if (date) {
            setEnd(withParts(end, { date }))
          }
          setActivePicker(null)
        }}
      />
      <TimePickerModal
        visible={activePicker === 'startTime'}
        hours={start.hours}
        minutes={start.minutes}
        use24HourClock={true}
        onDismiss={() => {
          setActivePicker(null)
        }}
        onConfirm={({ hours, minutes }) => {
          setStart(withParts(start, { hours, minutes }))
          setActivePicker(null)
        }}
      />
      <TimePickerModal
        visible={activePicker === 'endTime'}
        hours={end.hours}
        minutes={end.minutes}
        use24HourClock={true}
        onDismiss={() => {
          setActivePicker(null)
        }}
        onConfirm={({ hours, minutes }) => {
          setEnd(withParts(end, { hours, minutes }))
          setActivePicker(null)
        }}
      />
    </Portal>
  )
}
