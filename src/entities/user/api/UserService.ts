import { api } from '~shared/api'
import type { User, AuthRefreshResponse, FormPayload } from '~shared/lib'

export default class UserService {
  refresh = async () => {
    try {
      const response = await api.get<AuthRefreshResponse>('/api/users/refresh')
      return response.data
    } catch (error) {
      throw error
    }
  }

  login = async (payload: FormPayload) => {
    try {
      const response = await api.post<AuthRefreshResponse>('/api/users/login', payload)
      return response.data
    } catch (error) {
      throw error
    }
  }

  logout = async () => {
    try {
      await api.post('/api/users/logout')
    } catch (error) {
      throw error
    }
  }

  createUser = async (userData: FormPayload) => {
    try {
      const response = await api.post<User>('/api/users/create', userData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  getUsers = async () => {
    try {
      const response = await api.get<User[]>('/api/users')
      return response.data
    } catch (error) {
      throw error
    }
  }
}
