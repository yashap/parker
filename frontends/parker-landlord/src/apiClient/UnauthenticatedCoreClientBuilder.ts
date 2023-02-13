import { Configuration, DefaultApiFactory } from '@parker/core-client'

export class UnauthenticatedCoreClientBuilder {
  public static build() {
    // TODO: provide a "tap 10 times" style workflow for setting the host
    return DefaultApiFactory(
      new Configuration({
        basePath: 'http://localhost:3501/core',
        baseOptions: {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      })
    )
  }
}
