import { MiddlewareConsumer, Module, NestModule, DynamicModule } from '@nestjs/common'
import { AuthConfig } from '../config'
import { AuthConfigInjectionToken } from './AuthConfigInjectionToken'
import { AuthMiddleware } from './AuthMiddleware'
import { SuperTokensService } from './SuperTokensService'

@Module({
  providers: [SuperTokensService],
  exports: [],
  controllers: [],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*')
  }

  static forRoot({ connectionURI, appInfo, apiKey }: AuthConfig): DynamicModule {
    return {
      providers: [
        {
          provide: AuthConfigInjectionToken,
          useValue: {
            appInfo,
            connectionURI,
            apiKey,
          },
        },
        SuperTokensService,
      ],
      exports: [],
      imports: [],
      module: AuthModule,
    }
  }
}
