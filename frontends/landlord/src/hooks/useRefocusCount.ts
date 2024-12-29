import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import { useCounter } from 'src/hooks/useCounter'

/**
 * Tells you how many times the screen has been refocused. Useful for things like putting in a dependency array for a
 * data fetching hook, so that the data is refetched when the screen is refocused (for example, returning to a screen
 * by pressing a "back" button in the nav).
 *
 * @returns The number of times the screen has been refocused
 */
export const useRefocusCount = () => {
  const [focusCount, incrementFocusCount] = useCounter(0)
  useFocusEffect(useCallback(incrementFocusCount, []))
  return Math.max(focusCount - 1, 0)
}
