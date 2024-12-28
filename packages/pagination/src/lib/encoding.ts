import { InputValidationError } from '@parker/errors'
import { Base64 } from 'js-base64'
import { Cursor, parseCursor, ParseOrdering } from './Cursor'

export const encodeCursor = <K extends string, V>(cursor: Cursor<K, V>): string => {
  return Base64.encode(JSON.stringify(cursor))
}

export const decodeCursor = <K extends string, V>(cursor: string, parseOrdering: ParseOrdering<K, V>): Cursor<K, V> => {
  try {
    const cursorObject: unknown = JSON.parse(Base64.decode(cursor))
    return parseCursor(cursorObject, parseOrdering)
  } catch (error) {
    throw new InputValidationError('Invalid cursor', { cause: error })
  }
}
