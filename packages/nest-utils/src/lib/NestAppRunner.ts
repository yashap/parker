import { INestApplication } from '@nestjs/common'
import { Logger } from '@parker/logging'

export class NestAppRunner {
  private static logger: Logger = new Logger(NestAppRunner.name)

  public static async run(app: INestApplication, serviceName: string, port: number): Promise<void> {
    await app.listen(port)
    this.logger.info(`🚀 ${serviceName} listening for requests`, { metadata: { port } })
  }
}
