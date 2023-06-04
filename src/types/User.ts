export type UserRoles = 'admin' | 'listener'

export type User = {
  login: string
  name: string
  email: string
  role: UserRoles
  surname?: string
}
