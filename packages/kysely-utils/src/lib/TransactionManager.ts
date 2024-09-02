import { Kysely, Transaction } from 'kysely'
import { ActiveTransactionContext } from './ActiveTransactionContext'

export class TransactionManager<DB> {
  constructor(private readonly db: Kysely<DB>) {}

  /**
   * Ensures that the code within the callback is run with a transaction in the context. If a transaction is already
   * running, this does nothing, while if no transaction is running, it will start a transaction, put it in the
   * propagated context, and then run the callback within said context. The idea is that you can write code that
   * naively runs against transactions, without having to pass a transaction around, or worry about whether or not any
   * of your child code is starting a "nested transaction" (starting a transaction within a transaction).
   *
   * If you're new to the magic of Context Propagation, see the README of @parker/context-propagation for details.
   *
   * Example Usage:
   *
   * ```typescript
   * const transactionManager = new TransactionManager(db)
   *
   * type User = { id: number; name: string }
   * const createUser = (name: string): Promise<User> => transactionManager.getConnection()
   *   .insertInto('User')
   *   .values({ name: 'Alice' })
   *   .returningAll()
   *   .executeTakeFirstOrThrow()
   *
   * // Here, the createUser calls run against a transaction
   * const { bob, anne } = await transactionManager.run(() => {
   *   const bob = await createUser('Bob')
   *   const anne = await createUser('Anne')
   *   return { bob, anne }
   * })
   * ```
   *
   * // Here, the create user call does not
   * const sam = await createUser('Sam')
   */
  public async run<T>(callback: () => Promise<T>): Promise<T> {
    const maybeActiveTransaction = ActiveTransactionContext.getContext() as Transaction<DB> | undefined
    if (maybeActiveTransaction) {
      return callback()
    }
    return this.db.transaction().execute(async (trx) => {
      return ActiveTransactionContext.runWithContext(trx as Transaction<unknown>, async () => {
        return callback()
      })
    })
  }

  /**
   * Returns either the active transaction, if there is one, else the base Kysely instance.
   *
   * See the `run` method for more details.
   */
  public getConnection(): Transaction<DB> | Kysely<DB> {
    const maybeActiveTransaction = ActiveTransactionContext.getContext() as Transaction<DB> | undefined
    return maybeActiveTransaction ?? this.db
  }
}
