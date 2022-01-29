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
          <AppCardWrapper
            v-for="genre in categories.items"
            :key="genre.id"
          >
            <AppCardCategory
              :category="genre"
              placeholder="/img/hashtag.png"
              categorySlug="genres"
            />
          </AppCardWrapper>
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
import AppPreloader from '~/components/AppPreloader.vue'
import AppCardWrapper from '~/components/AppListCard/AppCardWrapper.vue'
import AppCardCategory from '~/components/AppListCard/AppCardCategory.vue'
import AppPagination from '~/components/AppPagination.vue'

export default defineComponent({
  components: {
    AppPreloader,
    AppCardWrapper,
    AppCardCategory,
    AppPagination
  },

  setup() {
    const apiQuery = '/api/genres'

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
