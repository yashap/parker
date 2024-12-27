import { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core'
import { ActiveTransactionContext } from 'src/lib/ActiveTransactionContext'
import { TransactionManager } from 'src/lib/TransactionManager'
import { User, TestDb, TestDbSchema } from 'src/test/TestDb'
import { userTable } from 'src/test/testSchema'

describe(TransactionManager.name, () => {
  let transactionManager: TransactionManager<TestDbSchema>

  beforeAll(() => {
    transactionManager = new TransactionManager(TestDb.db())
  })

  const createUser = async (name: string): Promise<User> => {
    const result = await transactionManager.getConnection().insert(userTable).values({ name }).returning()
    expect(result).toHaveLength(1)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return result[0]!
  }

  const getAllUsers = (): Promise<User[]> => {
    return transactionManager.getConnection().query.userTable.findMany({
      orderBy: (users, { asc }) => [asc(users.name)],
    })
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
      const alice = await createUser('Alice')
      const bob = await createUser('Bob')
      return { alice, bob }
    })

    expect(alice.name).toBe('Alice')
    expect(bob.name).toBe('Bob')
    expect(await getAllUsers()).toStrictEqual([alice, bob])
  })

  it('transaction should rollback if an error is thrown', async () => {
    await expect(
      transactionManager.run(async () => {
        await createUser('Alice')
        await createUser('Bob')
        throw new Error('Fake failure')
      })
    ).rejects.toEqual(new Error('Fake failure'))

    expect(await getAllUsers()).toStrictEqual([])
  })

  it("transaction shouldn't affect non-transaction code", async () => {
    const alice = await createUser('Alice')

    await expect(
      transactionManager.run(async () => {
        await createUser('Sam')
        await createUser('Frank')
        throw new Error('Fake failure')
      })
    ).rejects.toEqual(new Error('Fake failure'))

    const bob = await createUser('Bob')

    expect(await getAllUsers()).toStrictEqual([alice, bob])
  })

  it('nested transactions use the same transaction', async () => {
    let transaction1: PgTransaction<PgQueryResultHKT> | undefined
    let transaction2: PgTransaction<PgQueryResultHKT> | undefined
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
