import { computed } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateAuthHeaders, type DatabaseService } from '~shared/api'
import { useUser, createUser, cleanUser } from '~shared/model'
import { type User, type AuthRefreshResponse } from '~shared/lib'
import type { UserService } from '~entities/user'
import type { FormPayload } from '~shared/lib'

export const useUserApi = (userService: UserService, dbService: DatabaseService) => {
  const queryClient = useQueryClient()
  const { user, isAuthChecking } = useUser()

  // Refresh mutation
  const { mutateAsync: refreshMutation, isPending: isRefreshing } = useMutation({
    mutationFn: userService.refresh,
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
    mutationFn: (credentials: FormPayload) => userService.login(credentials),
    onSuccess: (data: AuthRefreshResponse) => {
      user.value = createUser(data.user)
      updateAuthHeaders()
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    }
  })

  // Logout mutation
  const { mutateAsync: logoutMutation, isPending: isLoggingOut } = useMutation({
    mutationFn: userService.logout,
    onSuccess: () => {
      cleanUser()
      updateAuthHeaders()
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    }
  })

  // Create user mutation
  const { mutateAsync: createUserMutation, isPending: isCreatingUser } = useMutation({
    mutationFn: (userData: FormPayload) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  // Get all users mutation
  const { mutateAsync: getUsersMutation, isPending: isLoadingUsers } = useMutation({
    mutationFn: userService.getUsers,
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
