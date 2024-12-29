import { CoreClient } from '@parker/core-client'
import { DependencyList } from 'react'
import useAsync from 'react-use/lib/useAsync'
import { AsyncState } from 'react-use/lib/useAsyncFn'
import { CoreClientBuilder } from 'src/apiClient/CoreClientBuilder'
import { useRefocusCount } from 'src/hooks/useRefocusCount'

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
  const client = CoreClientBuilder.build()
  // Ensure data is refetched when the screen is refocused
  const refocusCount = useRefocusCount()
  return useAsync(() => func(client), [refocusCount, ...(deps ?? [])])
}
