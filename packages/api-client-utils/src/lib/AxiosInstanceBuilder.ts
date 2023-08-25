import { ServerError } from '@parker/errors'
import axios, { AxiosInstance, CreateAxiosDefaults, isAxiosError } from 'axios'

const DEFAULT_TIMEOUT_MS: number = 60 * 1000

export type AxiosConfig = CreateAxiosDefaults & {
  baseURL: string
  token?: string
  locale?: string
}

export class AxiosInstanceBuilder {
  public static build({ headers, token, locale, timeout, ...rest }: AxiosConfig): AxiosInstance {
    const axiosAgent = axios.create({
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(locale && { 'Accept-Language': locale }),
      },
      timeout: timeout ?? DEFAULT_TIMEOUT_MS,
    })
    axiosAgent.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isAxiosError(error)) {
          const status = error.status
          const payload = error.response?.data
          if (status && payload) {
            throw ServerError.fromDto(payload, status)
          }
        }
        // TODO: better classify/wrap other errors (timeout, etc.)
        throw error
      }
    )
    return axiosAgent
  }
}
