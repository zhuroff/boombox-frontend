import { api } from '~shared/api'
import type { User, AuthRefreshResponse, FormPayload } from '~shared/lib'

export default class UserService {
  refresh = async () => {
    const response = await api.get<AuthRefreshResponse>('/api/users/refresh')
    return response.data
  }

  login = async (payload: FormPayload) => {
    const response = await api.post<AuthRefreshResponse>('/api/users/login', payload)
    return response.data
  }

  logout = async () => {
    await api.post('/api/users/logout')
  }

  createUser = async (userData: FormPayload) => {
    const response = await api.post<User>('/api/users/create', userData)
    return response.data
  }

  getUsers = async () => {
    const response = await api.get<User[]>('/api/users')
    return response.data
  }
}
