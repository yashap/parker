import { HttpException } from '@nestjs/common'

export const isHttpException = (error: unknown): error is HttpException => {
  const httpException = error as HttpException
  return typeof httpException.getResponse === 'function' && typeof httpException.getStatus === 'function'
}
