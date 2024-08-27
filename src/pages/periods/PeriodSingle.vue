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
        :withSearch="false"
      />
    </transition-group>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCategory } from '~/hooks/useCategory'
import Preloader from '~/components/Preloader.vue'
import CategoryHero from '~/components/CategoryHero.vue'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'

const entityType = 'periods'
const {
  data,
  isDataFetched,
  setUploadedImage,
  sortAlbumsByYears,
  totalCounts
} = useCategory(entityType)

const albumList = computed(() => (
  sortAlbumsByYears([...(data.value?.albums || []), ...(data.value?.embeddedAlbums || [])])
    .map((album) => ({
      ...album,
      caption: `${album.artist!.title} / ${album.period!.title} / ${album.genre!.title}`
    }))
))
</script>
