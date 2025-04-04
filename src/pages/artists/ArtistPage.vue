<template>
  <section class="section">
    <transition name="fade">
      <Preloader
        v-if="!isFetched"
        mode="light"
      />
    </transition>
    <transition-group name="flyUp">
      <CategoryHero
        v-if="isFetched && data"
        :entity="pageEntityKey"
        :data="data"
        :description="totalCounts"
        @setUploadedImage="setUploadedImage"
      />
      <section
        class="content"
        key="content"
      >
        <EntityCards
          v-if="isFetched && !!albumList.length"
          :entities="albumList"
          :isDraggable="false"
          :isDeletable="false"
          entityKey="albums"
          placeholderPreview="/img/album.webp"
          @deleteEntity="confirmDelete"
        />
        <!-- <Paginator
          v-if="paginationConfig?.totalPages > 1"
          key="pagination"
          :config="paginationConfig"
          :pagination="pagination"
          :style="{ marginTop: 'auto' }"
          :updatePaginationState="updatePaginationState"
        /> -->
      </section>
    </transition-group>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useGlobalStore from '~/store/global'
import useEntityPage from '~/shared/useEntityPage'
import Preloader from '~/components/Preloader.vue'
import CategoryHero from '~/components/CategoryHero.vue'
import EntityCards from '~/components/EntityCards.vue'
import Paginator from '~/components/Paginator.vue'

const pageEntityKey = ref('artists')

const { globalGetters: { localize } } = useGlobalStore()
const { data, isFetched } = useEntityPage<Category>(pageEntityKey)

const albumList = computed<BasicEntity[]>(() => (
  [...(data.value?.albums || []), ...(data.value?.embeddedAlbums || [])]
))

const totalCounts = computed(() => (
  localize('totalAlbums') + `: ${(data.value?.albums?.length || 0) + (data.value?.embeddedAlbums?.length || 0)}`
))

const setUploadedImage = (payload: any /* UploadImageResult */) => {
  console.log(payload)
  // if (data.value) {
  //   data.value[payload.key] = payload.url
  // }
}

const confirmDelete = () => {

}

console.log(albumList)
</script>
