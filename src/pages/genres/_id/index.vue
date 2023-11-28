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
        cardType="CardBox"
        rootPath="albums"
        cardClass="card-box"
        placeholderImage="/img/album.webp"
        :isDataFetched="isDataFetched"
        :pageHeading="''"
        :dataList="albumList"
        :withSearch="false"
      />
    </transition-group>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useCategory } from '~/hooks/useCategory'
import Preloader from '~/components/Preloader.vue'
import CategoryHero from '~/components/CategoryHero.vue'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'

export default defineComponent({
  name: 'GenrePage',
  components: {
    Preloader,
    CategoryHero,
    ListPageTemplate
  },
  setup() {
    const entityType = 'genres'
    const {
      data,
      isDataFetched,
      setUploadedImage,
      totalCounts
    } = useCategory(entityType)

    const albumList = computed(() => (
      data.value?.albums || []
    ))

    return {
      data,
      isDataFetched,
      setUploadedImage,
      totalCounts,
      entityType,
      albumList
    }
  }
})
</script>
