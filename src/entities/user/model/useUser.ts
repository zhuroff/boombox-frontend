import { computed, ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateAuthHeaders } from '~app/api'
import { UserRole, type User } from './types'
import type { DatabaseService } from '~shared/api'
import type { FormPayload } from '~widgets/form'

const createUser = (user?: User): User => {
  return {
    _id: user?._id || '',
    login: user?.login || '',
    email: user?.email || '',
    role: user?.role || UserRole.guest,
    dateCreated: user?.dateCreated || ''
  }
}

const user = ref(createUser())

const isAuthChecking = ref(true)

const isAdmin = computed(() => user.value.role === UserRole.admin)
const isListener = computed(() => user.value.role === UserRole.listener)
const isGuest = computed(() => user.value.role === UserRole.guest)
const isAuthorized = computed(() => {
  const currentUser = user.value
  const token = localStorage.getItem('token')
  return !!token && !!currentUser._id
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

export const useUserApi = (dbService: DatabaseService) => {
  const queryClient = useQueryClient()

  // Refresh mutation
  const { mutateAsync: refreshMutation, isPending: isRefreshing } = useMutation({
    mutationFn: dbService.refresh,
    onSuccess: (data) => {
      user.value = createUser(data.user)
      localStorage.setItem('token', data.accessToken)
      updateAuthHeaders()
    },
    onError: () => {
      user.value = createUser()
      localStorage.removeItem('token')
      updateAuthHeaders()
    }
  })

  // Check authorization on mount
  const checkAuthorization = async () => {
    try {
      isAuthChecking.value = true
      await refreshMutation()
    } catch (error) {
      console.error(error)
    } finally {
      isAuthChecking.value = false
    }
  }

  // Login mutation
  const { mutateAsync: loginMutation, isPending: isLoggingIn } = useMutation({
    mutationFn: (credentials: FormPayload) => dbService.login(credentials),
    onSuccess: (data: AuthResponse) => {
      user.value = createUser(data.user)
      localStorage.setItem('token', data.accessToken)
      updateAuthHeaders()
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    }
  })

  // Logout mutation
  const { mutateAsync: logoutMutation, isPending: isLoggingOut } = useMutation({
    mutationFn: dbService.logout,
    onSuccess: () => {
      user.value = createUser()
      localStorage.removeItem('token')
      updateAuthHeaders()
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    }
  })

  // Create user mutation
  const { mutateAsync: createUserMutation, isPending: isCreatingUser } = useMutation({
    mutationFn: (userData: FormPayload) => dbService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  // Get all users query
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => dbService.getUsers(),
    enabled: computed(() => user.value.role === UserRole.admin)
  })

  return {
    users,
    isLoggingIn,
    isLoggingOut,
    isCreatingUser,
    isLoadingUsers,
    isRefreshing,
    login: loginMutation,
    logout: logoutMutation,
    createUser: createUserMutation,
    checkAuthorization
  }
}
