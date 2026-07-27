import { TimeRuleOverrideDto } from '@parker/parking-client'
import React from 'react'
import { View } from 'react-native'
import { Button, Text, useTheme } from 'react-native-paper'
import { instantPlusHours, nowInstant } from 'src/components/availability/availabilityTime'

const DURATION_OPTIONS: { label: string; hours: number }[] = [
  { label: '1h', hours: 1 },
  { label: '4h', hours: 4 },
  { label: '8h', hours: 8 },
  { label: '24h', hours: 24 },
]

interface QuickOverrideActionsProps {
  onAdd: (override: TimeRuleOverrideDto) => void
}

/** One-tap overrides that start now and last for a preset duration, e.g. "make available for the next 4 hours". */
export const QuickOverrideActions: React.FC<QuickOverrideActionsProps> = ({ onAdd }) => {
  const theme = useTheme()

  const addForDuration = (isAvailable: boolean, hours: number) => {
    const startsAt = nowInstant()
    onAdd({ startsAt, endsAt: instantPlusHours(startsAt, hours), isAvailable })
  }

  const renderRow = (kind: 'available' | 'blocked', label: string, isAvailable: boolean) => (
    <View style={{ marginBottom: 8 }}>
      <Text variant='bodySmall' style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4 }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {DURATION_OPTIONS.map((option) => (
          <Button
            key={option.hours}
            testID={`quickOverride-${kind}-${option.hours}h`}
            mode='outlined'
            compact
            onPress={() => {
              addForDuration(isAvailable, option.hours)
            }}
          >
            {option.label}
          </Button>
        ))}
      </View>
    </View>
  )

  return (
    <View>
      {renderRow('available', 'Available for the next…', true)}
      {renderRow('blocked', 'Blocked for the next…', false)}
    </View>
  )
}
