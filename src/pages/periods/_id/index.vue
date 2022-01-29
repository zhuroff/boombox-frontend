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
          categorySlug="periods"
          @setCategoryImage="setCategoryImage"
        />

        <ul
          v-if="category.isFetched"
          class="cardlist"
        >
          <AppCardWrapper
            v-for="album in category.data.albums"
            :key="album.folderid"
          >
            <component
              :is="album.iframe ? 'AppCardFrame' : 'AppCardAlbum'"
              :album="album"
            />
          </AppCardWrapper>
        </ul>
      </transition-group>
    </div>
  </section>  
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import { useCategory } from '~/shared/categories'
import AppPreloader from '~/components/AppPreloader.vue'
import CategoryHero from '~/components/AppCategories/CategoryHero.vue'
import AppCardWrapper from '~/components/AppListCard/AppCardWrapper.vue'
import AppCardAlbum from '~/components/AppListCard/AppCardAlbum.vue'
import AppCardFrame from '~/components/AppListCard/AppCardFrame.vue'

export default defineComponent({
  components: {
    AppPreloader,
    CategoryHero,
    AppCardWrapper,
    AppCardAlbum,
    AppCardFrame
  },

  setup() {
    const apiQuery = '/api/periods'
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
