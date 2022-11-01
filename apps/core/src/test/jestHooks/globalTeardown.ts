import { PrismaClient } from '@prisma/client'
import { setTestDBUrl } from './setTestDBUrl'

const teardown = async (): Promise<void> => {
  setTestDBUrl()
  const client = new PrismaClient()
  await client.$connect()
  await client.parkingSpot.deleteMany({ where: {} })
  await client.user.deleteMany({ where: {} })
  await client.$disconnect()
}

export default teardown
