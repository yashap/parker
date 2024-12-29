import { CoreClient } from '@parker/core-client'
import { useFocusEffect } from 'expo-router'
import { DependencyList, useCallback, useState } from 'react'
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
   * a page is focused, the data is refetched. Otherwise when you press "back" from a page, the data is not refetched,
   * and you can see stale data.
   */
  const client = CoreClientBuilder.build()
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [focusCount, incrementFocusCount] = useCounter(0)
  useFocusEffect(
    useCallback(() => {
      incrementFocusCount()
      // This gets called when the route becomes unfocused
      return () => {
        setIsFirstLoad(false)
      }
    }, [])
  )
  // So that the very first focus of the page doesn't trigger a refresh, only re-focusing
  const refreshCount = isFirstLoad ? 0 : focusCount
  return useAsync(() => func(client), [refreshCount, ...(deps ?? [])])
}
