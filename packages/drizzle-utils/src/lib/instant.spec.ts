import { Temporal } from '@js-temporal/polyfill'
import { instant } from 'src/lib/instant'
import { User, TestDb, Post } from 'src/test/TestDb'
import { postTable, userTable } from 'src/test/testSchema'

describe(instant.name, () => {
  let user: User

  const createUser = async (name: string): Promise<User> => {
    const result = await TestDb.db().insert(userTable).values({ name }).returning()
    expect(result).toHaveLength(1)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return result[0]!
  }

  const createPost = async (sentAt: Temporal.Instant, message = 'Test Message', author: User = user): Promise<Post> => {
    const result = await TestDb.db().insert(postTable).values({ authorId: author.id, message, sentAt }).returning()
    expect(result).toHaveLength(1)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return result[0]!
  }

  const getAllPosts = (): Promise<Post[]> => {
    return TestDb.db().query.postTable.findMany({
      orderBy: (posts, { asc }) => [asc(posts.sentAt)],
    })
  }

  beforeEach(async () => {
    user = await createUser('Bob')
  })

  it('should save and retrieve timestamps as instants', async () => {
    const firstPost = await createPost(Temporal.Instant.from('2021-01-01T13:14:15.123Z'), 'First Post')
    const secondPost = await createPost(Temporal.Instant.from('2021-03-06T07:05:39.321Z'), 'Second Post')
    const allPosts = await getAllPosts()

    expect(allPosts).toStrictEqual([
      {
        id: firstPost.id,
        createdAt: firstPost.createdAt,
        updatedAt: firstPost.updatedAt,
        authorId: user.id,
        message: 'First Post',
        sentAt: Temporal.Instant.from('2021-01-01T13:14:15.123Z'),
      },
      {
        id: secondPost.id,
        createdAt: secondPost.createdAt,
        updatedAt: secondPost.updatedAt,
        authorId: user.id,
        message: 'Second Post',
        sentAt: Temporal.Instant.from('2021-03-06T07:05:39.321Z'),
      },
    ])
  })

  it('accepts timezones other than UTC as input, but still stores them as UTC', async () => {
    const firstPost = await createPost(Temporal.Instant.from('2021-01-01T13:14:15.123-03:00'), 'First Post')
    const secondPost = await createPost(Temporal.Instant.from('2021-03-06T07:05:39.321-03:00'), 'Second Post')
    const allPosts = await getAllPosts()

    expect(allPosts).toStrictEqual([
      {
        id: firstPost.id,
        createdAt: firstPost.createdAt,
        updatedAt: firstPost.updatedAt,
        authorId: user.id,
        message: 'First Post',
        sentAt: Temporal.Instant.from('2021-01-01T16:14:15.123Z'),
      },
      {
        id: secondPost.id,
        createdAt: secondPost.createdAt,
        updatedAt: secondPost.updatedAt,
        authorId: user.id,
        message: 'Second Post',
        sentAt: Temporal.Instant.from('2021-03-06T10:05:39.321Z'),
      },
    ])
  })
})
