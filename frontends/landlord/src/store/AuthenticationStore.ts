import { UserDto } from '@parker/core-client'
import { UnauthenticatedCoreClientBuilder } from '../apiClient/UnauthenticatedCoreClientBuilder'

// TODO: convert to mobx store, and make it actually login
export class AuthenticationStore {
  private static authenticatedUser: UserDto | undefined = undefined
  private static token: string | undefined

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static async login(email: string, _password: string): Promise<void> {
    // TODO: stop creating a user during the login flow, once I have real user registration, auth, etc.
    const coreClient = UnauthenticatedCoreClientBuilder.build()
    const user = await coreClient.users.create({ fullName: 'Fake Name', email })
    this.authenticatedUser = user
    // TODO: real token
    this.token = user.id
  }

  public static getToken(): string {
    if (!this.token) {
      // TODO: better error
      throw new Error('Tried to get token before logging in')
    }
    return this.token
  }

  public static getAuthenticatedUser(): UserDto {
    if (!this.authenticatedUser) {
      // TODO: better error
      throw new Error('Tried to get authenticated user before logging in')
    }
    return this.authenticatedUser
  }
}
