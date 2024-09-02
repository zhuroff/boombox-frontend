<template>
  <section class="section">
    <transition name="fade">
      <Preloader
        v-if="!isDataFetched"
        mode="light"
      />
    </transition>
    <transition-group name="flyUp">
      <CategoryHero
        v-if="isDataFetched && data"
        :entity="entityType"
        :data="data"
        :description="totalCounts"
        @setUploadedImage="setUploadedImage"
      >
        <template #hero-content>
          <Button
            v-if="isAdmin"
            icon="delete"
            size="medium"
            className="--delete"
            isText
            @click="callDelConfirmation"
          />
        </template>
      </CategoryHero>
      <ListPageTemplate
        placeholderImage="/img/album.webp"
        :isDataFetched="isDataFetched"
        :dataList="albumList"
        isDraggable
        @orderChanged="changeAlbumsOrder"
      />
    </transition-group>
    <Modal
      v-if="isDelConfirm"
      :isModalActive="isDelConfirm"
      @closeModal="delReject"
    >
      <Confirmation
        :message="localize('delConfirmMessage')"
        @confirm="deleteCompilation"
        @reject="delReject"
      />
    </Modal>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CollectionEntityRes } from '~/types/ReqRes'
import { useCategory } from '~/hooks/useCategory'
import type { BasicEntity, DraggableEvent } from '~/types/Common'
import { useSinglePage } from '~/hooks/useSinglePage'
import { useGathering } from '~/hooks/useGathering'
import useGlobalStore from '~/store/global'
import CollectionEntity from '~/classes/CollectionEntity'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'
import Preloader from '~/components/Preloader.vue'
import CategoryHero from '~/components/CategoryHero.vue'
import Button from '~/components/Button.vue'
import Confirmation from '~/components/Confirmation.vue'
import Modal from '~/components/Modal.vue'

const entityType = 'collections'

const {
  data,
  isDataFetched,
  setUploadedImage,
  totalCounts
} = useCategory(entityType)

const { deleteEntry } = useSinglePage<
  CollectionEntityRes<BasicEntity>,
  CollectionEntity<BasicEntity>,
  CollectionEntityRes<BasicEntity>
>(CollectionEntity, 'CollectionCard', 'collections')

const {
  globalGetters: { localize, authConfig }
} = useGlobalStore()

const { reorder } = useGathering()
const isDelConfirm = ref(false)

const isAdmin = computed(() => (
  authConfig.value.user?.role === 'admin'
))

const albumList = computed(() => (
  (data.value?.albums || [])
    .map((album) => ({
      ...album,
      caption: `${album.artist!.title} / ${album.period!.title} / ${album.genre!.title}`
    }))
))

const changeAlbumsOrder = (event: DraggableEvent) => {
  if (!data.value) return false
  const payload: ReorderPayload = {
    oldOrder: event.oldIndex,
    newOrder: event.newIndex,
    entityID: data.value._id
  }

  reorder('collections', payload)
}

const delReject = () => {
  isDelConfirm.value = false
}

const callDelConfirmation = () => {
  isDelConfirm.value = true
}

const deleteCompilation = () => {
  if (!data.value) return false
  deleteEntry('collections', data.value._id)
}
</script>

<style lang="scss" scoped>
@import '~/scss/variables';

.hero {
  .--delete {
    position: absolute;
    fill: $white;
    stroke: $white;
    opacity: 0;
    right: 3.5rem;
    top: 1.25rem;
    transition: opacity 0.3s $animation;
  }

  &:hover {
    .--delete {
      opacity: 1;
      transition: opacity 0.3s $animation;
    }
  }
}
</style>
