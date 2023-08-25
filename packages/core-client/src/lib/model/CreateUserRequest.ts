import { UserSchema } from './User'

export const CreateUserRequestSchema = UserSchema.omit({ id: true })
