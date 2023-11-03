import { showToast } from './showToast'

const LAST_RESORT_ERROR_MESSAGE: string = 'Something went wrong'

export const showErrorToast = (error: unknown, defaultErrorMessage?: string) => {
  const message = (error as Partial<Error> | undefined)?.message ?? defaultErrorMessage ?? LAST_RESORT_ERROR_MESSAGE
  showToast({ message })
}
