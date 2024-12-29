export interface User {
  id: string
  isPrimaryUser: boolean
  emails: string[]
  phoneNumbers: string[]
  timeJoined: number
}
