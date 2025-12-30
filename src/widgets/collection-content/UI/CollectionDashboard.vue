<template>
  <VueDraggableNext
    handle=".--drag"
    tag="ul"
    :class="['collection__dashboard']"
    :animation="300"
    @end="(event) => emit('orderChanged', event)"
  >
    <CollectionSingleAlbum
      v-for="entity in entities"
      :key="entity._id"
      :album="entity"
      @deleteEntity="(payload) => emit('deleteEntity', payload)"
      @updatePost="(payload) => emit('updatePost', payload)"
    />
  </VueDraggableNext>
</template>

<script setup lang="ts">
import { VueDraggableNext } from 'vue-draggable-next'
import type { DeletePayload, DraggableEvent } from '~shared/lib'
import type { CompilationAlbum } from '~entities/collection'
import CollectionSingleAlbum from './CollectionSingleAlbum.vue'

type Props = {
  entities: CompilationAlbum[]
}

type Emits = {
  (e: 'orderChanged', event: DraggableEvent): void
  (e: 'deleteEntity', payload: DeletePayload): void
  (e: 'updatePost', payload: [string, string]): void
}

defineProps<Props>()

const emit = defineEmits<Emits>()
</script>

<style scoped lang="scss">
@use '~app/styles/variables' as var;

.collection__dashboard {
  display: flex;
  flex-direction: column;
  gap: var.$mainPadding * 2;
}
</style>