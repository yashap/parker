import { Inject, Injectable } from '@nestjs/common'
import { required } from '@parker/errors'
import supertokens from 'supertokens-node'
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
      recipeList: required(authConfig.recipeList, 'No recipe list provided'),
    })
  }
}
