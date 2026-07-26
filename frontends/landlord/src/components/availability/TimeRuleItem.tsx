import { TimeRuleDto } from '@parker/parking-client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, Card, HelperText, IconButton, Text } from 'react-native-paper'
import { TimePickerModal } from 'react-native-paper-dates'
import {
  formatTimeOfDay,
  timeOfDayFromHoursMinutes,
  timeOfDayToHoursMinutes,
} from 'src/components/availability/availabilityTime'

type PickerField = 'startTime' | 'endTime'

interface TimeRuleItemProps {
  rule: TimeRuleDto
  error?: string
  onUpdate: (rule: TimeRuleDto) => void
  onDelete: () => void
}

export const TimeRuleItem: React.FC<TimeRuleItemProps> = ({ rule, error, onUpdate, onDelete }) => {
  const [activePicker, setActivePicker] = useState<PickerField | null>(null)

  const handleConfirm = (field: PickerField, { hours, minutes }: { hours: number; minutes: number }) => {
    onUpdate({ ...rule, [field]: timeOfDayFromHoursMinutes(hours, minutes) })
    setActivePicker(null)
  }

  const activeTime = activePicker ? timeOfDayToHoursMinutes(rule[activePicker]) : { hours: 9, minutes: 0 }

  return (
    <Card style={{ marginBottom: 8 }}>
      <Card.Content>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text variant='titleMedium' style={{ flex: 1 }}>
            {rule.day}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Button
              mode='outlined'
              compact
              onPress={() => {
                setActivePicker('startTime')
              }}
            >
              {formatTimeOfDay(rule.startTime)}
            </Button>
            <Text>to</Text>
            <Button
              mode='outlined'
              compact
              onPress={() => {
                setActivePicker('endTime')
              }}
            >
              {formatTimeOfDay(rule.endTime)}
            </Button>
            <IconButton icon='delete' size={20} onPress={onDelete} />
          </View>
        </View>
        {error ? (
          <HelperText type='error' visible={true}>
            {error}
          </HelperText>
        ) : null}
      </Card.Content>
      <TimePickerModal
        visible={activePicker !== null}
        onDismiss={() => {
          setActivePicker(null)
        }}
        onConfirm={({ hours, minutes }) => {
          if (activePicker) {
            handleConfirm(activePicker, { hours, minutes })
          }
        }}
        hours={activeTime.hours}
        minutes={activeTime.minutes}
        use24HourClock={true}
      />
    </Card>
  )
}
