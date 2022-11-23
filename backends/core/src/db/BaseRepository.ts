import { INestApplication, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

export abstract class BaseRepository implements OnModuleInit {
  // Ensure just one PrismaClient for the app (one DB connection pool)
  private static prismaSingleton: PrismaClient = new PrismaClient()

  // But still allow convenient access via this.prisma
  protected prisma: PrismaClient = BaseRepository.prismaSingleton

  public async onModuleInit(): Promise<void> {
    await this.prisma.$connect()
  }

  // See: https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks
  public async enableShutdownHooks(app: INestApplication) {
    this.prisma.$on('beforeExit', async () => {
      await app.close()
    })
  }
}
