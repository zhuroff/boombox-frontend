<template>
  <div class="tracklist__row-cell --pointer --fix --compilation">
    <Button
      v-if="isCompilation"
      icon="minus"
      size="small"
      isText
      className="tracklist__row-action"
      @click="() => entityToDelete = trackID"
    />
    <Button
      v-else
      icon="plus"
      size="small"
      isText
      className="tracklist__row-action"
      @click="openCompilationsModal"
    />
    <Modal
      v-if="isCompilationLoading || compilations"
      :isModalActive="isCompilationLoading"
      @closeModal="closeCollectionModal"
    >
      <!-- <GatheringTabs
        v-if="!isCompilationLoading && compilations"
        :isLoading="isCompilationLoading"
        :results="compilations"
        :pagination="pagePagination"
        :entityID="trackID"
        placeholderImage="/img/album.webp"
        entityType="compilations"
      /> -->
    </Modal>
    <Modal
      v-if="entityToDelete"
      :isModalActive="entityToDelete !== null"
      @closeModal="delReject"
    >
      <Confirmation
        :message="localize('compilations.trackDelConfirmation')"
        @confirm="removeTrackFromCompilation"
        @reject="delReject"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { BasicEntity } from '~/types/Common'
// import { useListPage } from '~/hooks/useListPage'
import { useTranslate } from '~features/localization'
import type { CompilationEntityRes } from '~/types/ReqRes'
import CompilationItem from '~/classes/CompilationItem'
import { Button } from '~shared/UI'
// import GatheringTabs from '~/components/GatheringTabs.vue'
import { Modal, Confirmation } from '~shared/UI'

interface Props {
  trackID: string
  isCompilation: boolean
}

interface Emits {
  (e: 'removeTrackFromCompilation'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { localize } = useTranslate()

// Temp
const fetchData = async (x: string) => Promise.resolve() as any

// const { fetchData, pagePagination } = useListPage<
//   CompilationEntityRes<BasicEntity>,
//   CompilationItem<BasicEntity>
// >(CompilationItem, '', '')

const isCompilationLoading = ref(false)
const entityToDelete = ref<string | null>(null)
const compilations = ref<CompilationItem<BasicEntity>[] | undefined>(undefined)

const openCompilationsModal = async () => {
  isCompilationLoading.value = true
  compilations.value = await fetchData('compilations')
  isCompilationLoading.value = false
}

const closeCollectionModal = () => {
  isCompilationLoading.value = false
  compilations.value = undefined
}

const delReject = () => {
  entityToDelete.value = null
}

const removeTrackFromCompilation = () => {
  emit('removeTrackFromCompilation')
  entityToDelete.value = null
}
</script>

<style lang="scss" scoped>
@use '~/scss/variables' as var;

.tracklist__row {

  &-action {

    &:hover {
      fill: inherit;
      stroke: inherit;
      color: var.$white;
    }
  }
}
</style>
