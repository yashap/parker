import { INestApplication } from '@nestjs/common'
import { Logger } from '@parker/logging'

export class NestAppRunner {
  private static logger: Logger = new Logger(NestAppRunner.name)

  public static async run(app: INestApplication, port: number): Promise<void> {
    await app.listen(port)
    this.logger.info(`🚀 Listening for requests`, { port })
  }
}
