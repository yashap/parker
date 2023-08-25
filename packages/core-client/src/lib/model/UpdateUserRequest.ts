import { UserSchema } from './User'

export const UpdateUserRequestSchema = UserSchema.omit({ id: true }).partial()
