<template>
  <Button
    :label="localize('settings.synchronize')"
    @click="handleSync"
  />
  <Loader
    v-if="isFetching"
    mode="light"
  />
</template>

<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import { useSync, type SyncDataPayload } from '~features/sync'
import { Button, Loader } from '~shared/UI'
import { DatabaseService } from '~shared/api'
import { useLocalization } from '~shared/model'

interface Emits {
  (e: 'passSyncData', payload: SyncDataPayload): void
}

const emit = defineEmits<Emits>()

const dbService = new DatabaseService()

const { localize } = useLocalization()

const {
  data,
  isFetching,
  refetch,
  reset
} = useSync(dbService)

const handleSync = () => {
  refetch()
}

watch(
  data,
  (value) => {
    value && emit('passSyncData', { data: value, reset })
  }
)

onUnmounted(() => {
  reset()
})
</script>
