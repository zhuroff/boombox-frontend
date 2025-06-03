<template>
  <Button
    :disabled="isAdmin"
    label="users.delete"
  />
</template>

<script setup lang="ts">
import { Button } from '~shared/UI'
import { useUser, useUserApi } from '~features/user'
import { DatabaseService } from '~shared/api'

const dbService = new DatabaseService()

const { deleteUser } = useUserApi(dbService)
const { isAdmin } = useUser()
</script>
