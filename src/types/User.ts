export type UserRoles = 'admin' | 'user'

export interface AuthData {
  login: string
  password: string
}

export interface User {
  login: string
  email: string
  role: UserRoles
}

export interface UserCreating extends User {
  password: string
  passwordRepeat: string
}
