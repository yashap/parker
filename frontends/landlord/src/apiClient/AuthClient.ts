import { AxiosInstance } from 'axios'
import { isArray, isString } from 'lodash'
import Supertokens from 'supertokens-react-native'
import { User } from 'src/types/User'

enum FormFieldId {
  email = 'email',
  password = 'password',
}

enum EmailPasswordStatusCode {
  Ok = 'OK',
  FieldError = 'FIELD_ERROR',
  EmailAlreadyExistsError = 'EMAIL_ALREADY_EXISTS_ERROR',
  EmailAlreadyVerifiedError = 'EMAIL_ALREADY_VERIFIED_ERROR',
  WrongCredentialError = 'WRONG_CREDENTIALS_ERROR',
  UnknownUserIdError = 'UNKNOWN_USER_ID_ERROR',
  UnknownEmailError = 'UNKNOWN_EMAIL_ERROR',
  ResetPasswordInvalidTokenError = 'RESET_PASSWORD_INVALID_TOKEN_ERROR',
  EmailVerificationInvalidTokenError = 'EMAIL_VERIFICATION_INVALID_TOKEN_ERROR',
}

const emailPasswordStatusCodeValues = new Set<EmailPasswordStatusCode>(Object.values(EmailPasswordStatusCode))

interface FormField {
  id: FormFieldId
  value: string
}

interface LogInRequestBody {
  formFields: FormField[]
}

export interface EmailLogInDetails {
  email: string
  password: string
}

interface LogInSuccessResponse {
  status: EmailPasswordStatusCode.Ok
  user: User
}

interface LogInFieldErrorResponse {
  status: EmailPasswordStatusCode.FieldError
  formFields: { error: string; id: string }[]
}

interface LogInErrorResponse {
  status: Exclude<EmailPasswordStatusCode, EmailPasswordStatusCode.Ok | EmailPasswordStatusCode.FieldError>
}

type LogInResponse = LogInSuccessResponse | LogInFieldErrorResponse | LogInErrorResponse

const getErrorMessage = (error: LogInFieldErrorResponse | LogInErrorResponse): string => {
  if (!emailPasswordStatusCodeValues.has(error.status)) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return `Unexpected error: ${error.status ?? JSON.stringify(error)}`
  }

  switch (error.status) {
    case EmailPasswordStatusCode.FieldError:
      return getFieldErrorMessage(error)
    case EmailPasswordStatusCode.EmailAlreadyExistsError:
      return 'Email already exists'
    case EmailPasswordStatusCode.EmailAlreadyVerifiedError:
      return 'Email already verified'
    case EmailPasswordStatusCode.WrongCredentialError:
      return 'Wrong email and/or password'
    case EmailPasswordStatusCode.UnknownUserIdError:
      return 'Unknown user'
    case EmailPasswordStatusCode.UnknownEmailError:
      return 'Unknown email'
    case EmailPasswordStatusCode.ResetPasswordInvalidTokenError:
      return 'Invalid reset password token'
    case EmailPasswordStatusCode.EmailVerificationInvalidTokenError:
      return 'Invalid email verification token'
  }
}

const getFieldErrorMessage = (fieldError: LogInFieldErrorResponse): string => {
  const messages: string[] = isArray(fieldError.formFields)
    ? fieldError.formFields.flatMap((field) => (isString(field.error) && field.error.length > 0 ? [field.error] : []))
    : []
  return messages.length > 0 ? messages.join(', ') : 'Something went wrong'
}

export class AuthClient {
  private readonly paths = {
    signUp: '/signup',
    logIn: '/signin',
  }

  public constructor(private axiosInstance: AxiosInstance) {}

  public async signUp(details: EmailLogInDetails): Promise<User> {
    await this.logOut()
    const { data } = await this.axiosInstance.post<LogInResponse>(this.paths.signUp, this.buildFormBody(details))
    if (data.status === EmailPasswordStatusCode.Ok) {
      return data.user
    }
    const errorMessage = getErrorMessage(data)
    // TODO: better error
    throw new Error(errorMessage)
  }

  public async logIn(details: EmailLogInDetails): Promise<User> {
    await this.logOut()
    const response = await this.axiosInstance.post(this.paths.logIn, this.buildFormBody(details))
    const data = response.data as LogInResponse
    if (data.status === EmailPasswordStatusCode.Ok) {
      return data.user
    }
    const errorMessage = getErrorMessage(data)
    // TODO: better error
    throw new Error(errorMessage)
  }

  public logOut(): Promise<void> {
    return Supertokens.signOut()
  }

  private buildFormBody({ email, password }: EmailLogInDetails): LogInRequestBody {
    return {
      formFields: [
        {
          id: FormFieldId.email,
          value: email,
        },
        {
          id: FormFieldId.password,
          value: password,
        },
      ],
    }
  }
}
