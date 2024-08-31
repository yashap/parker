import { Logger } from '@parker/logging'
import { Express } from 'express'
import * as http from 'http'

export class ExpressAppRunner {
  private static logger: Logger = new Logger(ExpressAppRunner.name)

  public static run(app: Express, port: number): http.Server {
    return app.listen(port, () => {
      ExpressAppRunner.logger.info(`🚀 Listening for requests`, { port })
    })
  }
}
