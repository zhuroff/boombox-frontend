<template>
  <VueDraggableNext
    handle=".--drag"
    tag="ul"
    :class="[`cardlist --${template}`]"
    :animation="300"
    :disabled="!isDraggable"
    @end="(event) => emit('orderChanged', event)"
  >
    <EntityCard
      v-for="entity in entities"
      :key="entity._id"
      :card="entity"
      :entityKey="entityKey"
      :placeholderPreview="placeholderPreview"
      :isDraggable="isDraggable"
      :isDeletable="isDeletable"
      :class="`--${props.template}`"
      @deleteEntity="(payload: DeletePayload) => emit('deleteEntity', payload)"
    />
  </VueDraggableNext>
</template>

<script setup lang="ts">
import { VueDraggableNext } from 'vue-draggable-next'
import type { DeletePayload } from '~shared/lib'
import EntityCard from './EntityCard.vue'
import type { UnifiedEntityCard } from '../lib/types'

type Props = {
  entities: UnifiedEntityCard[]
  entityKey: string
  isDraggable?: boolean
  isDeletable?: boolean
  template?: 'col' | 'row' | 'offset'
  placeholderPreview: string
}

type Emits = {
  (e: 'orderChanged', event: unknown): void
  (e: 'deleteEntity', payload: DeletePayload): void
}

const props = withDefaults(defineProps<Props>(), {
  template: 'row'
})

const emit = defineEmits<Emits>()
</script>

<style lang="scss" scoped>
@use '~app/styles/variables' as var;

.cardlist {
  display: flex;
  flex-wrap: wrap;
  gap: var.$basicPadding;

  &.--col {
    flex-direction: column;

    .cardlist__item {
      width: 100%;
    }
  }

  &.--row {
    flex-direction: row;
  }

  @include var.media('>=laptop') {
    margin-bottom: auto;
  }
}
</style>
