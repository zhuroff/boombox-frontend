<template>
  <section class="section">
    <transition name="fade">
      <Preloader v-if="!category.isFetched" mode="light" />
    </transition>

    <transition-group name="flyUp">
      <CategoryHero v-if="category.isFetched" :data="category.data" :description="categoryDescription" slug="genres"
        @setUploadedImage="setUploadedImage" />

      <ul v-if="category.isFetched" class="cardlist">
        <!-- <CardWrapper v-for="album in category.data.albums" :key="album._id">
          <component :is="album.frame ? 'CardFrame' : 'CardAlbum'" :album="album" />
        </CardWrapper> -->
      </ul>
    </transition-group>
  </section>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import { useCategory } from '~/hooks/useCategories'
import Preloader from '~/components/Preloader.vue'
import CategoryHero from '~/components/Hero/CategoryHero.vue'
// import CardWrapper from '~/components/Cards/CardWrapper.vue'
// import CardAlbum from '~/components/Cards/CardAlbum.vue'
import CardFrame from '~/components/Cards/CardFrame.vue'

export default defineComponent({
  components: {
    Preloader,
    CategoryHero,
    // CardWrapper,
    // CardAlbum,
    CardFrame
  },

  setup() {
    const apiQuery = '/api/genres'
    const {
      category,
      setUploadedImage,
      categoryDescription
    } = useCategory(apiQuery)

    return {
      category,
      setUploadedImage,
      categoryDescription
    }
  }
})

</script>
