<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader v-if="!categories.isFetched" mode="light" />
    </transition>

    <transition-group name="flyUp">
      <ul v-if="categories.isFetched" class="cardlist">
        <CardWrapper v-for="period in categories.data" :key="period.id">
          <CardCategory :category="period" placeholder="/img/period.webp" categorySlug="periods" />
        </CardWrapper>
      </ul>

      <PagePagination v-if="categories.isFetched && categories.pagination.totalPages > 1" :pagination="categories.pagination"
        @switchPagination="switchPagination" />
    </transition-group>
  </section>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import { useCategories } from '~/hooks/useCategories'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import CardWrapper from '~/components/Cards/CardWrapper.vue'
import CardCategory from '~/components/Cards/CardCategory.vue'
import PagePagination from '~/components/Pagination/Pagination.vue'

export default defineComponent({
  components: {
    AppPreloader,
    CardWrapper,
    CardCategory,
    PagePagination
  },

  setup() {
    const apiQuery = '/api/periods'

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
