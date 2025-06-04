import { computed, ref } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateAuthHeaders, type DatabaseService } from '~shared/api'
import { UserRole, type User, type FormPayload, type AuthRefreshResponse } from '~shared/lib'

const createUser = (user?: User): User => {
  return {
    _id: user?._id || '',
    login: user?.login || '',
    email: user?.email || '',
    role: user?.role || UserRole.guest,
    dateCreated: user?.dateCreated || ''
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

export const useUserApi = (dbService: DatabaseService) => {
  const queryClient = useQueryClient()

  // Refresh mutation
  const { mutateAsync: refreshMutation, isPending: isRefreshing } = useMutation({
    mutationFn: dbService.refresh,
    onSuccess: (data) => {
      user.value = createUser(data.user)
      updateAuthHeaders()
    },
    onError: () => {
      cleanUser()
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
    onSuccess: (data: AuthRefreshResponse) => {
      user.value = createUser(data.user)
      updateAuthHeaders()
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    }
  })

  // Logout mutation
  const { mutateAsync: logoutMutation, isPending: isLoggingOut } = useMutation({
    mutationFn: dbService.logout,
    onSuccess: () => {
      cleanUser()
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

  // Get all users mutation
  const { mutateAsync: getUsersMutation, isPending: isLoadingUsers } = useMutation({
    mutationFn: dbService.getUsers,
    onSuccess: (data) => {
      queryClient.setQueryData(['users'], data)
    }
  })

  // Delete user mutation
  const { mutateAsync: deleteUserMutation, isPending: isDeletingUser } = useMutation({
    mutationFn: (userId: string) => dbService.deleteEntity<User>('users', userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const users = computed(() => queryClient.getQueryData(['users']))

  return {
    users,
    isLoggingIn,
    isLoggingOut,
    isCreatingUser,
    isLoadingUsers,
    isDeletingUser,
    isRefreshing,
    login: loginMutation,
    logout: logoutMutation,
    createUser: createUserMutation,
    getUsers: getUsersMutation,
    deleteUser: deleteUserMutation,
    checkAuthorization
  }
}
