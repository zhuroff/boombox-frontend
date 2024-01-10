<template>
  <div class="tracklist__row-cell --pointer --fix">
    <Button
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { BasicEntity } from '~/types/Common'
import { useListPage } from '~/hooks/useListPage'
import { CompilationEntityRes } from '~/types/ReqRes'
import CompilationItem from '~/classes/CompilationItem'
import Button from '~/components/Button.vue'
import GatheringTabs from '~/components/GatheringTabs.vue'
import Modal from '~/components/Modal.vue'

export default defineComponent({
  name: 'TrackItemCompilation',
  components: {
    Modal,
    Button,
    GatheringTabs
  },
  props: {
    trackID: {
      type: String,
      required: true
    }
  },
  setup() {
    const { fetchData, pagePagination } = useListPage<
      CompilationEntityRes<BasicEntity>,
      CompilationItem<BasicEntity>
    >(CompilationItem, '', '')
    const isCompilationLoading = ref(false)
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

    return {
      openCompilationsModal,
      closeCollectionModal,
      isCompilationLoading,
      pagePagination,
      compilations
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
~/classes/CompilationItem