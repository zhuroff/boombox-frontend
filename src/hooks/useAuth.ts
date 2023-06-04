import { ref, reactive } from 'vue'
import { User } from '../types/User'

export const useAuth = () => {
  let isAuthenticated = ref(false)
  const user = reactive<User>(null!)

  const setIsAuthenticated = (value: boolean) => {
    isAuthenticated.value = value
  }

  return {
    isAuthenticated,
    setIsAuthenticated
  }
}