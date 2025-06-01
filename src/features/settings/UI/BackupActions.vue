<template>
  <Button
    :size="size"
    :label="targetAction?.label"
    @click="isEnabled = true"
  />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useBackup, BackupService } from '~features/backup'
import { Button } from '~shared/UI'
import type { BackupAction } from '~features/backup/model/types'

interface Props {
  action: BackupAction
  size?: 'small' | 'medium' | 'large'
  value?: string
}

interface Emits {
  (e: 'onEmit', data: any): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
})
const emit = defineEmits<Emits>()

const service = new BackupService()

const {
  data,
  isEnabled,
  targetAction
} = useBackup(props.action, service, props.value)

watch(
  data,
  (value) => {
    data && emit('onEmit', value)
    isEnabled.value = false
  }
)
</script>
