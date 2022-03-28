<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!categories.isFetched"
        mode="light"
      />
    </transition>
      
    <div id="scrollspace">
      <transition-group name="flyUp">
        <ul
          v-if="categories.isFetched"
          class="cardlist"
        >
          <CardWrapper
            v-for="artist in categories.data"
            :key="artist.id"
          >
            <CardCategory
              :category="artist"
              placeholder="/img/artist.jpg"
              categorySlug="artists"
            />
          </CardWrapper>
        </ul>

        <AppPagination
          v-if="categories.isFetched && categories.pagination.totalPages > 1"
          :pagination="categories.pagination"
          @switchPagination="switchPagination"
        />
      </transition-group>
    </div>
  </section>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import { useCategories } from '~/shared/categories'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import CardWrapper from '~/components/Cards/CardWrapper.vue'
import CardCategory from '~/components/Cards/CardCategory.vue'
import AppPagination from '~/components/AppPagination.vue'

export default defineComponent({
  components: {
    AppPreloader,
    CardWrapper,
    CardCategory,
    AppPagination
  },

  setup() {
    const apiQuery = '/api/artists'

    const {
      categories,
      switchPagination
    } = useCategories(apiQuery)

    return {
      categories,
      switchPagination
    }
  }
})

</script>