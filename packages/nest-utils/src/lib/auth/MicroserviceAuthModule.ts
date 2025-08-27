import { MiddlewareConsumer, Module, NestModule, DynamicModule } from '@nestjs/common'
import Session from 'supertokens-node/recipe/session'
import { AuthConfig } from './AuthConfig'
import { AuthConfigInjectionToken } from './AuthConfigInjectionToken'
import { AuthModuleConfig } from './AuthModuleConfig'
import { SuperTokensService } from './SuperTokensService'

/**
 * Use this in microservices where you only care about guarding API endpoints with auth, not providing login, signup,
 * logout, etc.
 */
@Module({
  providers: [SuperTokensService],
  exports: [],
  controllers: [],
})
export class MicroserviceAuthModule implements NestModule {
  public configure(_consumer: MiddlewareConsumer) {
    // Nothing to do here
  }

  static forRoot({ apiUrl, supertokensUrl, websiteDomain, apiKey }: AuthModuleConfig): DynamicModule {
    const authConfig: AuthConfig = {
      appInfo: {
        appName: 'Parker',
        apiDomain: apiUrl,
        websiteDomain: websiteDomain ?? 'http://localhost:3000',
      },
      connectionURI: supertokensUrl ?? 'http://localhost:3567',
      apiKey,
      recipeList: [Session.init()],
    }
    return {
      providers: [
        {
          provide: AuthConfigInjectionToken,
          useValue: authConfig,
        },
        SuperTokensService,
      ],
      exports: [],
      imports: [],
      module: MicroserviceAuthModule,
    }
  }
}
