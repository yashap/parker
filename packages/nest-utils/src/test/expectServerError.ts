import { ServerError } from '@parker/errors'

interface ServerErrorConstructor<E extends ServerError> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): E
}

export const expectServerError = async <E extends ServerError>(
  maybeFailed: Promise<unknown>,
  errorConstructor: ServerErrorConstructor<E>
): Promise<E> => {
  await expect(maybeFailed).rejects.toThrow(errorConstructor)
  try {
    await maybeFailed
  } catch (error) {
    return error as E
  }
  throw new Error('Unreachable')
}
