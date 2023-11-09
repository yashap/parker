/**
 * A method decorator to enforce that certain functionality is only ever used in a testing environment
 * @param targetPrototype the prototype of the class to which the method belongs
 * @param methodName the name of the method being decorated
 * @param descriptor the property descriptor of the method being decorated
 */
export const TestOnly = (_targetPrototype: unknown, methodName: string, descriptor: PropertyDescriptor) => ({
  value(...args: unknown[]) {
    if (process.env['NODE_ENV'] !== 'test') {
      throw new Error(`${methodName} is a test only method, can only be called from tests`)
    }
    const result = descriptor.value.apply(this, args)
    return result
  },
})
