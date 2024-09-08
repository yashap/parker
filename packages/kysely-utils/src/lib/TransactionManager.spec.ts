import { Transaction } from 'kysely'
import { Database, Person, TestDb } from '../test/TestDb'
import { ActiveTransactionContext } from './ActiveTransactionContext'
import { TransactionManager } from './TransactionManager'

describe(TransactionManager.name, () => {
  let transactionManager: TransactionManager<Database>

  beforeAll(() => {
    transactionManager = new TransactionManager(TestDb.db())
  })

  const createPerson = (name: string): Promise<Person> => {
    return transactionManager
      .getConnection()
      .insertInto('Person')
      .values({ name })
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  const getAllPeople = (): Promise<Person[]> => {
    return transactionManager.getConnection().selectFrom('Person').selectAll().execute()
  }

  it('should set the ActiveTransactionContext', async () => {
    let transaction = ActiveTransactionContext.getContext()
    expect(transaction).toBeUndefined()
    await transactionManager.run(async () => {
      transaction = ActiveTransactionContext.getContext()
    })
    expect(transaction).not.toBeUndefined()
  })

  it('transaction should commit if nothing goes wrong', async () => {
    const { alice, bob } = await transactionManager.run(async () => {
      const alice = await createPerson('Alice')
      const bob = await createPerson('Bob')
      return { alice, bob }
    })

    expect(alice.name).toBe('Alice')
    expect(bob.name).toBe('Bob')
    expect(await getAllPeople()).toHaveLength(2)
  })

  it('transaction should rollback if an error is thrown', async () => {
    expect(
      transactionManager.run(async () => {
        await createPerson('Alice')
        await createPerson('Bob')
        throw new Error('Fake failure')
      })
    ).rejects.toEqual(new Error('Fake failure'))

    expect(await getAllPeople()).toHaveLength(0)
  })

  it('nested transactions use the same transaction', async () => {
    let transaction1: Transaction<unknown> | undefined
    let transaction2: Transaction<unknown> | undefined
    await transactionManager.run(async () => {
      transaction1 = ActiveTransactionContext.getContext()
      await transactionManager.run(async () => {
        transaction2 = ActiveTransactionContext.getContext()
      })
    })

    expect(transaction1).not.toBeUndefined()
    expect(transaction2).not.toBeUndefined()
    expect(transaction1).toBe(transaction2)
  })
})
