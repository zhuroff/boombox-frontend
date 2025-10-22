import { computed, ref } from 'vue'
import { UserRole, type User } from '~shared/lib'

export const createUser = (user?: User): User => {
  return {
    _id: user?._id || '',
    login: user?.login || '',
    email: user?.email || '',
    role: user?.role || UserRole.guest,
  }
}

export const cleanUser = () => {
  user.value = createUser()
}

const user = ref(createUser())

const isAuthChecking = ref(true)

const isAdmin = computed(() => user.value.role === UserRole.admin)
const isListener = computed(() => user.value.role === UserRole.listener)
const isGuest = computed(() => user.value.role === UserRole.guest)
const isAuthorized = computed(() => {
  const currentUser = user.value
  return !!currentUser._id
})

export const useUser = () => {
  return {
    user,
    isAdmin,
    isListener,
    isGuest,
    isAuthorized,
    isAuthChecking
  }
}
