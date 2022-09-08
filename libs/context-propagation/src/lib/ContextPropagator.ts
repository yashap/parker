import type { AsyncLocalStorage } from 'async_hooks'

export class ContextPropagator<T> {
  private readonly storage: AsyncLocalStorage<T> | undefined = this.createStorage()

  /**
   * TODO describe
   *
   * @param context
   * @param callback
   * @returns
   */
  public runWithContext<R>(context: T, callback: () => R): R {
    if (!this.storage) {
      return callback()
    }

    return this.storage.run(context, () => callback())
  }

  /**
   * TODO describe
   *
   * @returns
   */
  public getContext(): T | undefined {
    return this.storage?.getStore()
  }

  private createStorage(): AsyncLocalStorage<T> | undefined {
    // Do not import CLS on platforms other than Node.js.
    if (!process?.versions?.node) {
      return undefined
    }

    // Import AsyncLocalStorage dynamically to make this class compatible on platforms other than Node.js.
    // eslint-disable-next-line
    return new (require('async_hooks').AsyncLocalStorage)() as AsyncLocalStorage<T>
  }
}
