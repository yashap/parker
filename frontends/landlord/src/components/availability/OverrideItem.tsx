import { TimeRuleOverrideDto } from '@parker/parking-client'
import React from 'react'
import { View } from 'react-native'
import { Card, Chip, HelperText, IconButton, Text, useTheme } from 'react-native-paper'
import { formatInstantInZone } from 'src/components/availability/availabilityTime'

interface OverrideItemProps {
  override: TimeRuleOverrideDto
  timeZone: string
  error?: string
  testID?: string
  onEdit: () => void
  onDelete: () => void
}

export const OverrideItem: React.FC<OverrideItemProps> = ({ override, timeZone, error, testID, onEdit, onDelete }) => {
  const theme = useTheme()
  return (
    <Card testID={testID} style={{ marginBottom: 8 }}>
      <Card.Content>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, gap: 4 }}>
            <Chip
              compact
              icon={override.isAvailable ? 'check-circle' : 'cancel'}
              style={{
                alignSelf: 'flex-start',
                backgroundColor: override.isAvailable ? theme.colors.secondaryContainer : theme.colors.errorContainer,
              }}
            >
              {override.isAvailable ? 'Available' : 'Blocked'}
            </Chip>
            <Text variant='bodyMedium'>
              {formatInstantInZone(override.startsAt, timeZone)} → {formatInstantInZone(override.endsAt, timeZone)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton icon='pencil' size={20} onPress={onEdit} />
            <IconButton icon='delete' size={20} onPress={onDelete} />
          </View>
        </View>
        {error ? (
          <HelperText type='error' visible={true}>
            {error}
          </HelperText>
        ) : null}
      </Card.Content>
    </Card>
  )
}
