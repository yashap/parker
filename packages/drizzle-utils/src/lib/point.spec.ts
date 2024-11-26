import { Point } from '@parker/geography'
import { User, users, TestDb, favouriteLocations, FavouriteLocation } from '../test/TestDb'
import { instant } from './instant'

describe(instant.name, () => {
  let user: User

  const createUser = async (name: string): Promise<User> => {
    const result = await TestDb.db().insert(users).values({ name }).returning()
    expect(result).toHaveLength(1)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return result[0]!
  }

  const createFavouriteLocation = async (
    name: string,
    location: Point,
    author: User = user
  ): Promise<FavouriteLocation> => {
    const result = await TestDb.db()
      .insert(favouriteLocations)
      .values({ userId: author.id, name, location })
      .returning()
    expect(result).toHaveLength(1)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return result[0]!
  }

  const getAllFavouriteLocations = (): Promise<FavouriteLocation[]> => {
    return TestDb.db().query.favouriteLocations.findMany({
      orderBy: (favouriteLocations, { asc }) => [asc(favouriteLocations.name)],
    })
  }

  beforeEach(async () => {
    user = await createUser('Bob')
  })

  it('should save and retrieve points', async () => {
    const firstLocation = await createFavouriteLocation('Gym', { longitude: 4.56, latitude: 1.23 })
    const secondLocation = await createFavouriteLocation('Home', { longitude: -5.67, latitude: 2.34 })
    const allLocations = await getAllFavouriteLocations()

    expect(allLocations).toStrictEqual([
      {
        id: firstLocation.id,
        userId: user.id,
        name: 'Gym',
        location: { longitude: 4.56, latitude: 1.23 },
      },
      {
        id: secondLocation.id,
        userId: user.id,
        name: 'Home',
        location: { longitude: -5.67, latitude: 2.34 },
      },
    ])
  })

  it('works with extreme longitudes', async () => {
    const firstLocation = await createFavouriteLocation('Gym', { longitude: 180, latitude: 1.23 })
    const secondLocation = await createFavouriteLocation('Home', { longitude: -180, latitude: 2.34 })
    const allLocations = await getAllFavouriteLocations()

    expect(allLocations).toStrictEqual([
      {
        id: firstLocation.id,
        userId: user.id,
        name: 'Gym',
        location: { longitude: 180, latitude: 1.23 },
      },
      {
        id: secondLocation.id,
        userId: user.id,
        name: 'Home',
        location: { longitude: -180, latitude: 2.34 },
      },
    ])
  })

  it('works with extreme latitudes', async () => {
    const firstLocation = await createFavouriteLocation('Gym', { longitude: 4.56, latitude: 90 })
    const secondLocation = await createFavouriteLocation('Home', { longitude: -5.67, latitude: -90 })
    const allLocations = await getAllFavouriteLocations()

    expect(allLocations).toStrictEqual([
      {
        id: firstLocation.id,
        userId: user.id,
        name: 'Gym',
        location: { longitude: 4.56, latitude: 90 },
      },
      {
        id: secondLocation.id,
        userId: user.id,
        name: 'Home',
        location: { longitude: -5.67, latitude: -90 },
      },
    ])
  })

  it("doesn't allow inserting illegal points", async () => {
    await expect(createFavouriteLocation('Gym', { longitude: 4.56, latitude: 90.1 })).rejects.toThrow()
    await expect(createFavouriteLocation('Home', { longitude: -5.67, latitude: -90.1 })).rejects.toThrow()
    await expect(createFavouriteLocation('Gym', { longitude: 180.1, latitude: 1.23 })).rejects.toThrow()
    await expect(createFavouriteLocation('Home', { longitude: -180.1, latitude: 2.34 })).rejects.toThrow()
  })
})