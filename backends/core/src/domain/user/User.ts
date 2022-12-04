import { UserDto } from '@parker/core-client'
import { Record } from 'immutable'

export type UserProps = UserDto

export class User extends Record<UserProps>({ id: '', email: '', fullName: '' }) {
  constructor(props: UserProps) {
    super(props)
  }
}
