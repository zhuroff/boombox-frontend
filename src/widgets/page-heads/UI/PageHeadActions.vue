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
import { useLocalization } from '~shared/model'
import type { ActionPropertyItem } from '~widgets/page-heads'

interface Props {
  actions: ActionPropertyItem[]
}

defineProps<Props>()

const { localize } = useLocalization()
</script>

<style scoped lang="scss">
@use '~/app/styles/variables' as var;

.album__hero {

  &-actions {
    display: flex;
    align-items: center;
    gap: var.$fieldPadding;

    @include var.media('<desktop') {
      margin: var.$mainPadding auto;
    }

    @include var.media('>=desktop') {
      justify-content: flex-end;
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
}
</style>
