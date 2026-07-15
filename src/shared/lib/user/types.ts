export enum UserRole {
  admin = 'admin',
  listener = 'listener',
  guest = 'guest'
}

export type User = {
  _id: string
  login: string
  email: string
  role: UserRole
}

export type AuthRefreshResponse = {
  user: User
  accessToken: string
  refreshToken: string
}
