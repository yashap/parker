import { assertTestOnly } from '@parker/core'
import { UnauthorizedError } from '@parker/errors'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { SessionContainer } from 'supertokens-node/recipe/session'
import { verifySession } from 'supertokens-node/recipe/session/framework/fastify'

declare module 'fastify' {
  interface FastifyRequest {
    session?: SessionContainer
  }
}

interface TestAuthData {
  userId: string
}

const TEST_AUTH_HEADER = 'x-test-auth-header'

let isAuthMocked = false

/**
 * For use exclusively in tests - makes requireSession skip real SuperTokens session verification, and instead
 * synthesize a session from the headers built by buildTestAuthHeaders.
 */
export const mockAuth = (): void => {
  assertTestOnly('mockAuth')
  isAuthMocked = true
}

/**
 * For use exclusively in tests - undoes mockAuth.
 */
export const unmockAuth = (): void => {
  assertTestOnly('unmockAuth')
  isAuthMocked = false
}

/**
 * For use exclusively in tests - builds the auth headers that requireSession understands when auth is mocked.
 */
export const buildTestAuthHeaders = (userId: string): Record<string, string> => {
  assertTestOnly('buildTestAuthHeaders')
  const testAuthData: TestAuthData = { userId }
  return {
    [TEST_AUTH_HEADER]: JSON.stringify(testAuthData),
  }
}

const addTestSession = (request: FastifyRequest): void => {
  assertTestOnly('addTestSession')
  // TODO: other fields?
  const session: Pick<SessionContainer, 'getUserId'> = {
    getUserId(): string {
      const header = request.headers[TEST_AUTH_HEADER]
      const testAuthData = JSON.parse(typeof header === 'string' ? header : '{}') as TestAuthData
      return testAuthData.userId
    },
  }
  request.session = session as SessionContainer
}

export const requireSession = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  if (isAuthMocked) {
    addTestSession(request)
    return
  }
  await verifySession()(request, reply)
}

export const getSessionUserId = (request: FastifyRequest): string => {
  const session = request.session
  if (!session) {
    throw new UnauthorizedError('No session present on request')
  }
  return session.getUserId()
}
