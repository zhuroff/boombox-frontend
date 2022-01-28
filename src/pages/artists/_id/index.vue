<template>

<section class="section">
  <div id="scrollspace">
    <CategoryHero
      :category="category"
      categorySlug="artists"
    />

    <ul class="cardlist">
      <AppCardWrapper
        v-for="album in category.albums"
        :key="album.folderid"
      >
        <component
          :is="album.iframe ? 'AppCardFrame' : 'AppCardAlbum'"
          :album="album"
        />
      </AppCardWrapper>
    </ul>
  </div>
</section>
  
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import { useCategory } from '~/shared/categories'
import CategoryHero from '~/components/AppCategories/CategoryHero.vue'
import AppCardWrapper from '~/components/AppListCard/AppCardWrapper.vue'
import AppCardAlbum from '~/components/AppListCard/AppCardAlbum.vue'
import AppCardFrame from '~/components/AppListCard/AppCardFrame.vue'

export default defineComponent({
  components: {
    CategoryHero,
    AppCardWrapper,
    AppCardAlbum,
    AppCardFrame
  },

  setup() {
    const apiQuery = '/api/artists'
    const { category } = useCategory(apiQuery)

    return { category }
  }
})

</script>
