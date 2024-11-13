import { Temporal } from '@js-temporal/polyfill'
import { User, users, TestDb, Post, posts } from '../test/TestDb'
import { instant } from './instant'

describe(instant.name, () => {
  let user: User

  const createUser = async (name: string): Promise<User> => {
    const result = await TestDb.db().insert(users).values({ name }).returning()
    expect(result).toHaveLength(1)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return result[0]!
  }

  const createPost = async (sentAt: Temporal.Instant, message = 'Test Message', author: User = user): Promise<Post> => {
    const result = await TestDb.db().insert(posts).values({ authorId: author.id, message, sentAt }).returning()
    expect(result).toHaveLength(1)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return result[0]!
  }

  const getAllPosts = (): Promise<Post[]> => {
    return TestDb.db().query.posts.findMany({
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
        authorId: user.id,
        message: 'First Post',
        sentAt: Temporal.Instant.from('2021-01-01T13:14:15.123Z'),
      },
      {
        id: secondPost.id,
        authorId: user.id,
        message: 'Second Post',
        sentAt: Temporal.Instant.from('2021-03-06T07:05:39.321Z'),
      },
    ])

    // Temporal.Instants don't work well with Jest's equality matchers, need to check more explicitly
    expect(allPosts[0]?.sentAt.toJSON()).toStrictEqual('2021-01-01T13:14:15.123Z')
    expect(allPosts[1]?.sentAt.toJSON()).toStrictEqual('2021-03-06T07:05:39.321Z')
  })

  it('accepts timezones other than UTC as input, but still stores them as UTC', async () => {
    const firstPost = await createPost(Temporal.Instant.from('2021-01-01T13:14:15.123-03:00'), 'First Post')
    const secondPost = await createPost(Temporal.Instant.from('2021-03-06T07:05:39.321-03:00'), 'Second Post')
    const allPosts = await getAllPosts()

    expect(allPosts).toStrictEqual([
      {
        id: firstPost.id,
        authorId: user.id,
        message: 'First Post',
        sentAt: Temporal.Instant.from('2021-01-01T16:14:15.123Z'),
      },
      {
        id: secondPost.id,
        authorId: user.id,
        message: 'Second Post',
        sentAt: Temporal.Instant.from('2021-03-06T10:05:39.321Z'),
      },
    ])

    // Temporal.Instants don't work well with Jest's equality matchers, need to check more explicitly
    expect(allPosts[0]?.sentAt.toJSON()).toStrictEqual('2021-01-01T16:14:15.123Z')
    expect(allPosts[1]?.sentAt.toJSON()).toStrictEqual('2021-03-06T10:05:39.321Z')
  })
})
