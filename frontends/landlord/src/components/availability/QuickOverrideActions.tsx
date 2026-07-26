import { TimeRuleOverrideDto } from '@parker/parking-client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, Menu } from 'react-native-paper'
import { instantPlusHours, nowInstant } from 'src/components/availability/availabilityTime'

const DURATION_OPTIONS: { label: string; hours: number }[] = [
  { label: '1 hour', hours: 1 },
  { label: '4 hours', hours: 4 },
  { label: '8 hours', hours: 8 },
  { label: '24 hours', hours: 24 },
]

interface QuickOverrideActionsProps {
  onAdd: (override: TimeRuleOverrideDto) => void
}

/** One-tap overrides that start now and last for a preset duration, e.g. "make available for the next 4 hours". */
export const QuickOverrideActions: React.FC<QuickOverrideActionsProps> = ({ onAdd }) => {
  const [openMenu, setOpenMenu] = useState<'available' | 'blocked' | null>(null)

  const addForDuration = (isAvailable: boolean, hours: number) => {
    const startsAt = nowInstant()
    onAdd({ startsAt, endsAt: instantPlusHours(startsAt, hours), isAvailable })
    setOpenMenu(null)
  }

  const renderMenu = (kind: 'available' | 'blocked', label: string, isAvailable: boolean) => (
    <Menu
      visible={openMenu === kind}
      onDismiss={() => {
        setOpenMenu(null)
      }}
      anchor={
        <Button
          mode='outlined'
          onPress={() => {
            setOpenMenu(kind)
          }}
        >
          {label}
        </Button>
      }
    >
      {DURATION_OPTIONS.map((option) => (
        <Menu.Item
          key={option.hours}
          title={option.label}
          onPress={() => {
            addForDuration(isAvailable, option.hours)
          }}
        />
      ))}
    </Menu>
  )

  return (
    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
      {renderMenu('available', 'Available for next…', true)}
      {renderMenu('blocked', 'Block for next…', false)}
    </View>
  )
}
