<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!category.isFetched"
        mode="light"
      />
    </transition>

    <div id="scrollspace">
      <transition-group name="flyUp">
        <CategoryHero
          v-if="category.isFetched"
          :category="category.data"
          categorySlug="artists"
          @setCategoryImage="setCategoryImage"
        />

        <ul
          v-if="category.isFetched"
          class="cardlist"
        >
          <CardWrapper
            v-for="album in category.data.albums"
            :key="album.folderid"
          >
            <component
              :is="album.iframe ? 'CardFrame' : 'CardAlbum'"
              :album="album"
            />
          </CardWrapper>
        </ul>
      </transition-group>
    </div>
  </section>  
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import { useCategory } from '~/shared/categories'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import CategoryHero from '~/components/Hero/CategoryHero.vue'
import CardWrapper from '~/components/Cards/CardWrapper.vue'
import CardAlbum from '~/components/Cards/CardAlbum.vue'
import CardFrame from '~/components/Cards/CardFrame.vue'

export default defineComponent({
  components: {
    AppPreloader,
    CategoryHero,
    CardWrapper,
    CardAlbum,
    CardFrame
  },

  setup() {
    const apiQuery = '/api/artists'
    const {
      category,
      setCategoryImage
    } = useCategory(apiQuery)

    return {
      category,
      setCategoryImage
    }
  }
})

</script>
