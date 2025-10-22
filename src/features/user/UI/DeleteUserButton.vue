<template>
  <Button
    :disabled="isAdmin"
    :label="localize('users.delete')"
  />
</template>

<script setup lang="ts">
import { Button } from '~shared/UI'
// import { useUserApi, UserService } from '~entities/user'
// import { DatabaseService } from '~shared/api'
import { useUser, useLocalization } from '~shared/model'

// const dbService = new DatabaseService()
// const userService = new UserService()

// const { deleteUser } = useUserApi(userService, dbService)

const { isAdmin } = useUser()

const { localize } = useLocalization()
</script>
