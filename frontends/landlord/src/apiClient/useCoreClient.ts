import { CoreClient } from '@parker/core-client'
import { useFocusEffect } from 'expo-router'
import { DependencyList, useCallback } from 'react'
import useAsync from 'react-use/lib/useAsync'
import { AsyncState } from 'react-use/lib/useAsyncFn'
import { CoreClientBuilder } from 'src/apiClient/CoreClientBuilder'
import { useCounter } from 'src/hooks/useCounter'

/**
 * Run a query using the core client. This is really just meant for reading the data that a component needs to render.
 * If you want to perform writes using CoreClient, you don't need to use a hook at all, just call
 * `CoreClientBuilder.build()`.
 *
 * @param func The function performing the query, using the core client.
 * @param deps Optional React dependency list
 * @returns The async state of the query
 */
export const useCoreClient = <T>(
  func: (coreClient: CoreClient) => Promise<T>,
  deps?: DependencyList
): AsyncState<T> => {
  /**
   * The implementation of this hook is more complex than you'd expect, because it uses `useFocusEffect`, so that when
   * a screen is refocused, the data is refetched. Otherwise when you refocus a screen (e.g. by presing "back" in the
   * main nav), the data is not refetched, and you get stuck with potentially stale data.
   */
  const client = CoreClientBuilder.build()
  const [focusCount, incrementFocusCount] = useCounter(0)
  useFocusEffect(useCallback(incrementFocusCount, []))
  // So that the very first focus of the page doesn't trigger a refresh, only refocusing
  const refreshCount = focusCount > 1 ? focusCount - 1 : 0
  return useAsync(() => func(client), [refreshCount, ...(deps ?? [])])
}
