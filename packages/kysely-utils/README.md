# @parker/kysely-utils

A small library to make working with [kysely](https://kysely.dev/) easier.

## Example Use Case

```ts
const transactionManager = new TransactionManager(db)

type User = { id: number; name: string }
const createUser = (name: string): Promise<User> =>
  transactionManager
    .getConnection()
    .insertInto('User')
    .values({ name: 'Alice' })
    .returningAll()
    .executeTakeFirstOrThrow()

const { bob, anne } = await transactionManager.run(() => {
  const bob = await createUser('Bob')
  const anne = await createUser('Anne')
  return { bob, anne }
})
```
