import { PrismaClient } from '@prisma/client'

interface PrismaModel {
  // eslint-disable-next-line no-empty-pattern
  deleteMany({ where: {} }): Promise<unknown>
}

export class TestDbOperations {
  private static client: PrismaClient = new PrismaClient()
  private static models: PrismaModel[] = [this.client.parkingSpot, this.client.user]

  public static async connect(): Promise<void> {
    await this.client.$connect()
  }

  public static async disconnect(): Promise<void> {
    await this.client.$connect()
  }

  public static async clear(): Promise<void> {
    for (const model of this.models) {
      await model.deleteMany({ where: {} })
    }
  }
}
