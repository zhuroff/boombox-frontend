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
        :message="lang('delConfirmMessage')"
        @confirm="deleteCompilation"
        @reject="delReject"
      />
    </Modal>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { CollectionEntityRes } from '~/types/ReqRes'
import { useCategory } from '~/hooks/useCategory'
import { BasicEntity, DraggableEvent, ReorderPayload } from '~/types/Common'
import { useSinglePage } from '~/hooks/useSinglePage'
import { useGathering } from '~/hooks/useGathering'
import { useLocales } from '~/hooks/useLocales'
import CollectionEntity from '~/classes/CollectionEntity'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'
import Preloader from '~/components/Preloader.vue'
import CategoryHero from '~/components/CategoryHero.vue'
import Button from '~/components/Button.vue'
import Confirmation from '~/components/Confirmation.vue'
import Modal from '~/components/Modal.vue'

export default defineComponent({
  name: 'CollectionPage',
  components: {
    Modal,
    Button,
    Preloader,
    Confirmation,
    CategoryHero,
    ListPageTemplate
  },
  setup() {
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

    const { lang } = useLocales()
    const { reorder } = useGathering()
    const isDelConfirm = ref(false)

    const albumList = computed(() => (
      (data.value?.albums || [])
        .map((album) => ({
          ...album,
          caption: `${album.artist.title} / ${album.period.title} / ${album.genre.title}`
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

    return {
      data,
      lang,
      delReject,
      isDelConfirm,
      isDataFetched,
      setUploadedImage,
      changeAlbumsOrder,
      deleteCompilation,
      callDelConfirmation,
      totalCounts,
      entityType,
      albumList
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../../../scss/variables';

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
