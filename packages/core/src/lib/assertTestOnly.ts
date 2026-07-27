/**
 * Asserts that the calling code is running in a test, otherwise throws an error. A plain-function alternative to the
 * `@TestOnly` decorator, for use in module-level functions (where decorators don't apply).
 *
 * Example usage:
 *
 * ```
 * export const mockFoo = (): void => {
 *   assertTestOnly('mockFoo')
 *   ...
 * }
 * ```
 *
 * @param name An optional name (e.g. of the calling function) to include in the error message
 */
export const assertTestOnly = (name?: string): void => {
  if (process.env['NODE_ENV']?.toLowerCase() !== 'test') {
    throw new Error(`${name ?? 'This'} is a test only method, can only be called from tests`)
  }
}
