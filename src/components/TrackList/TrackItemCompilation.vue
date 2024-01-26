<template>
  <div class="tracklist__row-cell --pointer --fix">
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
      <GatheringTabs
        v-if="!isCompilationLoading && compilations"
        :isLoading="isCompilationLoading"
        :results="compilations"
        :pagination="pagePagination"
        :entityID="trackID"
        placeholderImage="/img/album.webp"
        entityType="compilations"
      />
    </Modal>
    <Modal
      v-if="entityToDelete"
      :isModalActive="entityToDelete !== null"
      @closeModal="delReject"
    >
      <Confirmation
        :message="lang('compilations.trackDelConfirmation')"
        @confirm="removeTrackFromCompilation"
        @reject="delReject"
      />
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { BasicEntity } from '~/types/Common'
import { useListPage } from '~/hooks/useListPage'
import { useLocales } from '~/hooks/useLocales'
import { CompilationEntityRes } from '~/types/ReqRes'
import CompilationItem from '~/classes/CompilationItem'
import Button from '~/components/Button.vue'
import GatheringTabs from '~/components/GatheringTabs.vue'
import Confirmation from '~/components/Confirmation.vue'
import Modal from '~/components/Modal.vue'

export default defineComponent({
  name: 'TrackItemCompilation',
  components: {
    Modal,
    Button,
    Confirmation,
    GatheringTabs
  },
  props: {
    trackID: {
      type: String,
      required: true
    },
    isCompilation: {
      type: Boolean,
      required: true
    }
  },
  setup(_, { emit }) {
    const { fetchData, pagePagination } = useListPage<
      CompilationEntityRes<BasicEntity>,
      CompilationItem<BasicEntity>
    >(CompilationItem, '', '')

    const { lang } = useLocales()

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

    return {
      removeTrackFromCompilation,
      openCompilationsModal,
      closeCollectionModal,
      isCompilationLoading,
      entityToDelete,
      pagePagination,
      compilations,
      delReject,
      lang
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables';
.tracklist__row {

  &-action {

    &:hover {
      fill: inherit;
      stroke: inherit;
      color: $white;
    }
  }
}
</style>
