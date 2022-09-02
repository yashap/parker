import { Record } from 'immutable'

export interface UserProps {
  id: string
  fullName: string
}

export class User extends Record<UserProps>({ id: '', fullName: '' }) {
  constructor(props: UserProps) {
    super(props)
  }
}
