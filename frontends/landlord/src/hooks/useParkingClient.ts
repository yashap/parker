import { ParkingClient } from '@parker/parking-client'
import { DependencyList } from 'react'
import useAsync from 'react-use/lib/useAsync'
import { AsyncState } from 'react-use/lib/useAsyncFn'
import { ParkingClientBuilder } from 'src/apiClient/ParkingClientBuilder'
import { useRefocusCount } from 'src/hooks/useRefocusCount'

/**
 * Run a query using the parking client. This is really just meant for reading the data that a component needs to render.
 * If you want to perform writes using ParkingClient, you don't need to use a hook at all, just call
 * `ParkingClientBuilder.build()`.
 *
 * @param func The function performing the query, using the parking client.
 * @param deps Optional React dependency list
 * @returns The async state of the query
 */
export const useParkingClient = <T>(
  func: (parkingClient: ParkingClient) => Promise<T>,
  deps?: DependencyList
): AsyncState<T> => {
  const client = ParkingClientBuilder.build()
  // Ensure data is refetched when the screen is refocused
  const refocusCount = useRefocusCount()
  return useAsync(() => func(client), [refocusCount, ...(deps ?? [])])
}
