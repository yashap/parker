import { ServerError } from '@parker/errors'
import { showToast } from './showToast'

const LAST_RESORT_ERROR_MESSAGE = 'Something went wrong'

export const showErrorToast = (error: unknown, defaultErrorMessage?: string) => {
  // TODO: maybe an error instanceof ServerError check?
  const serverError = error as Partial<ServerError> | undefined
  const message = serverError?.message ?? defaultErrorMessage ?? LAST_RESORT_ERROR_MESSAGE
  const metadata = serverError?.metadata
  // TODO: nicer way to serialize errors (probably something standardized in the error lib?)
  showToast({ message: metadata ? `${message}: ${JSON.stringify(metadata)}` : message })
}
