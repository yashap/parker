import { DynamicModule } from '@nestjs/common'
import { AuthModule as BaseAuthModule } from '@parker/nest-utils'
import { AuthConfig } from 'src/config'

export class AuthModule {
  static forRoot({ connectionURI, appInfo, apiKey }: AuthConfig): DynamicModule {
    return BaseAuthModule.forRoot({
      appInfo,
      connectionURI,
      apiKey,
    })
  }
}
