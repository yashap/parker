import { GenericError } from '@ory/kratos-client'
import { AxiosError } from 'axios'
import { showMessage } from 'react-native-flash-message'

export class AuthFormUtils {
  public static camelize<T>(str: string): keyof T {
    return str.replace(/_([a-z])/g, (g) => g[1]?.toUpperCase() ?? '') as keyof T
  }

  public static handleFlowInitError(_error: AxiosError): void {
    return
  }

  public static handleFormSubmitError<T>(setConfig: (p: T) => void, initialize: () => void, logout?: () => void) {
    return (err: AxiosError) => {
      if (err.response) {
        const responsePayload = err.response?.data as
          | (GenericError & { error?: Error & { reason?: string } })
          | undefined
        switch (err.response.status) {
          case 400:
            if (typeof responsePayload?.error === 'object') {
              console.warn(err.response.data)

              showMessage({
                message: `${responsePayload.error?.message}: ${responsePayload.error?.reason}`,
                type: 'danger',
              })

              return Promise.resolve()
            }

            console.warn('Form validation failed:', err.response.data)
            setConfig(err.response.data as T)
            return Promise.resolve()
          case 404:
          case 410:
            // This happens when the flow is, for example, expired or was deleted.
            // We simply re-initialize the flow if that happens!
            console.warn('Flow could not be found, reloading page.')
            initialize()
            return Promise.resolve()
          case 403:
          case 401:
            if (!logout) {
              console.error(`Received unexpected 401/403 status code: `, err, err.response.data)
              return Promise.resolve()
            }

            // This happens when the privileged session is expired but the user tried
            // to modify a privileged field (e.g. change the password).
            console.warn(
              'The server indicated that this action is not allowed for you. The most likely cause of that is that you modified a privileged field (e.g. your password) but your ORY Kratos Login Session is too old.'
            )
            showMessage({
              message: 'Please re-authenticate before making these changes.',
              type: 'warning',
            })
            logout()
            return Promise.resolve()
        }
      }

      console.error(err, err.response?.data)
      return Promise.resolve()
    }
  }
}
