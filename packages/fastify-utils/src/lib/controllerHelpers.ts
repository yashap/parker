import { NotFoundError } from '@parker/errors'

/**
 * Builds the standard "not found" error for a given entity type. Free-function replacement for the old
 * BaseController.buildEntityNotFoundError helper.
 */
export const buildEntityNotFoundError = (entityName: string): NotFoundError => {
  return new NotFoundError(`${entityName} not found`)
}

/**
 * Returns the given value if it's present, otherwise throws the standard "not found" error for the given entity type.
 * Free-function replacement for the old BaseController.getEntityOrNotFound helper.
 */
export const getEntityOrNotFound = <T>(maybeValue: T | undefined | null, entityName: string): T => {
  if (!maybeValue) {
    throw buildEntityNotFoundError(entityName)
  }
  return maybeValue
}
