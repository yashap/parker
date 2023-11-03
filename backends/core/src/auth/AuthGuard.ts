import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Response } from 'express'
import { Error as SuperTokensError } from 'supertokens-node'
import { VerifySessionOptions } from 'supertokens-node/recipe/session'
import { verifySession } from 'supertokens-node/recipe/session/framework/express'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly verifyOptions?: VerifySessionOptions) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp()

    let err = undefined
    const resp = ctx.getResponse<Response>()

    // verifySession mutates the response object if the session is invalid (e.g. no token, stale token, etc.)
    await verifySession(this.verifyOptions)(ctx.getRequest(), resp, (res) => {
      err = res
    })

    if (resp.headersSent) {
      throw new SuperTokensError({
        message: 'RESPONSE_SENT',
        type: 'RESPONSE_SENT',
      })
    }

    if (err) {
      throw err
    }

    return true
  }
}
