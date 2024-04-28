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
  passwordConfirm: string
}

export type UserResponse = User & { _id: string }

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: UserResponse
}

export interface AuthConfig {
  isAuthenticated: boolean
  user: UserResponse
}
