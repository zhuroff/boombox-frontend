<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!categoryData.isFetched"
        mode="light"
      />
    </transition>
      
    <div id="scrollspace">
      <transition-group name="flyUp">
        <ul
          v-if="categoryData.isFetched"
          class="cardlist"
        >
          <AppCardWrapper
            v-for="artist in categoryData.items"
            :key="artist.id"
          >
            <AppCardCategory
              :category="artist"
              placeholder="/img/artist.jpg"
              categorySlug="artists"
            />
          </AppCardWrapper>
        </ul>

        <AppPagination
          v-if="categoryData.isFetched && categoryData.pagination.totalPages > 1"
          :pagination="categoryData.pagination"
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
    const apiQuery = '/api/artists'

    const {
      categoryData,
      switchPagination
    } = useCategories(apiQuery)

    return {
      categoryData,
      switchPagination
    }
  }
})

</script>
