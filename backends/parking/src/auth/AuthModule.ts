import { DynamicModule } from '@nestjs/common'
import { AuthModule as BaseAuthModule } from '@parker/nest-utils'
import EmailPassword from 'supertokens-node/recipe/emailpassword'
import Session from 'supertokens-node/recipe/session'
import { AuthConfig } from 'src/config'

export class AuthModule {
  static forRoot({ connectionURI, appInfo, apiKey }: AuthConfig): DynamicModule {
    return BaseAuthModule.forRoot({
      appInfo,
      connectionURI,
      apiKey,
      recipeList: [EmailPassword.init(), Session.init()],
    })
  }
}
