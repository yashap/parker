import { Configuration, FrontendApiFactory } from '@ory/kratos-client'
import axiosFactory from 'axios'
import { config } from '../config'

export class KratosClientBuilder {
  public static build(): ReturnType<typeof FrontendApiFactory> {
    return FrontendApiFactory(
      new Configuration({
        basePath: config.kratosUrl,
        baseOptions: {
          // Setting this is very important as axios will send the CSRF cookie otherwise
          // which causes problems with ORY Kratos' security detection.
          withCredentials: false,
          timeout: 10000,
        },
      }),
      config.kratosUrl,
      // Types of created Axios instance are subtly different
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      axiosFactory.create() as any
    )
  }
}
