import { CoreClient } from '@parker/core-client'
import { DependencyList } from 'react'
import useAsync from 'react-use/lib/useAsync'
import { AsyncState } from 'react-use/lib/useAsyncFn'
import { CoreClientBuilder } from 'src/apiClient/CoreClientBuilder'

export const useCoreClient = <T>(
  func: (coreClient: CoreClient) => Promise<T>,
  deps?: DependencyList
): AsyncState<T> => {
  const client = CoreClientBuilder.build()
  return useAsync(() => func(client), deps)
}
