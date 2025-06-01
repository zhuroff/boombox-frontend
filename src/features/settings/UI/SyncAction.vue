<template>
  <Button
    label="settings.synchronize"
    @click="handleSync"
  />
  <Loader
    v-if="isFetching"
    mode="light"
  />
  <Modal
    :isModalActive="showModal"
    @closeModal="handleCloseModal"
  >
    <AlbumSyncList
      v-if="data"
      :sections="data"
    />
  </Modal>
</template>

<script setup lang="ts">
import { useSync } from '~features/settings'
import { AlbumSyncList } from '~entities/album'
import { Button, Loader, Modal } from '~shared/UI'
import { DatabaseService } from '~shared/api'
import { onUnmounted, ref, watch } from 'vue'

const dbService = new DatabaseService()
const showModal = ref(false)

const {
  isFetched,
  data,
  isFetching,
  refetch,
  reset
} = useSync(dbService)

const handleSync = () => {
  refetch()
}

watch(isFetched, (newValue) => {
  if (newValue) {
    showModal.value = true
  }
})

const handleCloseModal = () => {
  showModal.value = false
  reset()
}

onUnmounted(() => {
  reset()
})
</script>
