import { buildServerErrorFromDto } from '@parker/errors'
import axios, { AxiosError, AxiosInstance, CreateAxiosDefaults } from 'axios'

const DEFAULT_TIMEOUT_MS: number = 60 * 1000

export type AxiosConfig = CreateAxiosDefaults & {
  baseURL: string
  token?: string
  locale?: string
}

export class AxiosInstanceBuilder {
  public static build({ headers, token, locale, timeout, ...rest }: AxiosConfig): AxiosInstance {
    console.warn('BUILT!!!!')
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
        const axiosError = error as AxiosError
        const status = axiosError.status
        const payload = axiosError.response?.data
        console.warn('Stuff', { status, payload, error })
        if (status && payload) {
          throw buildServerErrorFromDto(payload, status)
        }
        // TODO: better classify/wrap other errors (timeout, etc.)
        throw error
      }
    )
    return axiosAgent
  }
}
