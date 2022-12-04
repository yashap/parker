import { ServerError } from '@parker/errors'
import axios, { AxiosInstance, AxiosResponse } from 'axios'

export interface ApiClientConfig {
  baseUrl: string
}

export class ApiClient {
  constructor(private readonly axiosInstance: AxiosInstance) {}

  public static build({ baseUrl }: ApiClientConfig): ApiClient {
    return new ApiClient(axios.create({ baseURL: baseUrl, validateStatus: (status) => status < 400 }))
  }

  public delete(path: string): Promise<void> {
    return this.liftError(async () => {
      const response = await this.axiosInstance.delete(path)
      return response.data
    })
  }

  public get<ResponseDto, QueryParams = unknown>(path: string, params?: QueryParams): Promise<ResponseDto> {
    return this.liftError(async () => {
      const response = await this.axiosInstance.get<ResponseDto>(path, { params })
      return response.data
    })
  }

  public patch<ResponseDto, PatchBody>(path: string, body: PatchBody): Promise<ResponseDto> {
    return this.liftError(async () => {
      const response = await this.axiosInstance.patch<ResponseDto, AxiosResponse<ResponseDto>, PatchBody>(path, body)
      return response.data
    })
  }

  public post<ResponseDto, PostBody>(path: string, body: PostBody): Promise<ResponseDto> {
    return this.liftError(async () => {
      const response = await this.axiosInstance.post<ResponseDto, AxiosResponse<ResponseDto>, PostBody>(path, body)
      return response.data
    })
  }

  private async liftError<T>(callback: () => Promise<T>): Promise<T> {
    try {
      return await callback()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorDto = error.response?.data ?? error
        const status = error.status ?? error.response?.status ?? 500
        throw ServerError.fromDto(errorDto, status)
      }
      throw ServerError.fromDto(error, 500)
    }
  }
}
