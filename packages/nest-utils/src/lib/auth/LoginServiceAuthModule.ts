import { MiddlewareConsumer, Module, NestModule, DynamicModule } from '@nestjs/common'
import EmailPassword from 'supertokens-node/recipe/emailpassword'
import Session from 'supertokens-node/recipe/session'
import { AuthConfig } from './AuthConfig'
import { AuthConfigInjectionToken } from './AuthConfigInjectionToken'
import { AuthEndpoints } from './AuthEndpoints'
import { AuthModuleConfig } from './AuthModuleConfig'
import { SuperTokensService } from './SuperTokensService'

/**
 * Use this in the service responsible for login, signup, logout, etc.
 */
@Module({
  providers: [SuperTokensService],
  exports: [],
  controllers: [],
})
export class LoginServiceAuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthEndpoints).forRoutes('*')
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
      recipeList: [EmailPassword.init(), Session.init()],
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
      module: LoginServiceAuthModule,
    }
  }
}
