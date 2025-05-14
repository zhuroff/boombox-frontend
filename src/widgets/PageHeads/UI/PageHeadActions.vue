<template>
  <div class="album__hero-actions">
    <Button
      v-for="action in actions"
      :key="action.icon"
      :icon="action.icon"
      :title="localize(action.title)"
      isRounded
      isInverted
      @click="action.action"
    />
  </div>
</template>

<script setup lang="ts">
import { Button } from '~shared/UI'
import useGlobalStore from '~/store/global'
import type { ActionPropertyItem } from '../model/types'

interface Props {
  actions: ActionPropertyItem[]
}

defineProps<Props>()

const { globalGetters: { localize } } = useGlobalStore()
</script>

<style scoped lang="scss">
.album__hero {

  &-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: flex-end;
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
