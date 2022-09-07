import { INestApplication, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/core-client'

export abstract class BaseRepository extends PrismaClient implements OnModuleInit {
  public async onModuleInit(): Promise<void> {
    await this.$connect()
  }

  // See: https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks
  public async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close()
    })
  }
}
