import { Inject, Injectable } from '@nestjs/common'
import supertokens from 'supertokens-node'
import Session from 'supertokens-node/recipe/session'
import { AuthConfig } from './AuthConfig'
import { AuthConfigInjectionToken } from './AuthConfigInjectionToken'

@Injectable()
export class SuperTokensService {
  constructor(@Inject(AuthConfigInjectionToken) authConfig: AuthConfig) {
    supertokens.init({
      appInfo: authConfig.appInfo,
      supertokens: {
        connectionURI: authConfig.connectionURI,
        apiKey: authConfig.apiKey,
      },
      recipeList: authConfig.recipeList ?? [Session.init()],
    })
  }
}
