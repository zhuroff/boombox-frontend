export type UserRoles = 'admin' | 'listener'

export interface AuthData {
  login: string
  password: string
}

export interface User {
  login: string
  name: string
  email: string
  role: UserRoles
  surname?: string
}
