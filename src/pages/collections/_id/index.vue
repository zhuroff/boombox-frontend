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
      />
      <ListPageTemplate
        placeholderImage="/img/album.webp"
        :isDataFetched="isDataFetched"
        :dataList="albumList"
        isDraggable
        @orderChanged="changeAlbumsOrder"
      />
    </transition-group>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useCategory } from '~/hooks/useCategory'
import { DraggableEvent, ReorderPayload } from '~/types/Common'
import { useGathering } from '~/hooks/useGathering'
import Preloader from '~/components/Preloader.vue'
import CategoryHero from '~/components/CategoryHero.vue'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'

export default defineComponent({
  name: 'CollectionPage',
  components: {
    Preloader,
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

    const { reorder } = useGathering()

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

    return {
      data,
      isDataFetched,
      setUploadedImage,
      changeAlbumsOrder,
      totalCounts,
      entityType,
      albumList
    }
  }
})
</script>
