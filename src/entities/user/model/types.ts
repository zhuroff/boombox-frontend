export enum UserRole {
  admin = 'admin',
  listener = 'listener',
  guest = 'guest'
}

export interface User {
  _id: string
  login: string
  email: string
  role: UserRole
  dateCreated: string
}
