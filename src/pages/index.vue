<template>

<section class="section">
  <div id="scrollspace">
    <!-- <div class="hero">
      <transition-group name="fade">
        <div
          v-if="allNews.length"
          class="hero__wrapper"
        >
          <div class="hero__content">
            <time class="hero__content-header">
              {{ readableDate(topNews.dates) }}
            </time>
            <div class="hero__content-title">{{ topNews.title }}</div>
            <div class="hero__content-description">{{ topNews.description }}</div>
            <a
              :href="topNews.site_url"
              target="_blank"
              class="hero__content-link"
            >Read more</a>
          </div>
          
          <div class="hero__cover">
            <img
              :src="topNews.images[0].image"
              :alt="topNews.title"
              class="hero__cover-image"
            >
          </div>
        </div>

        <div
          v-else-if="!allNews.length && !errorMessage"
          class="hero__placeholder"
        >
          <AppPreloader />
        </div>
      </transition-group>
    </div>

    <div class="news">
      <ul
        v-if="allNews.length"
        class="news__list"
      >
        <AppCardWrapper
          v-for="item in allNews"
          :key="item.id"
        >
          <AppCardNews :item="item" />
        </AppCardWrapper>
      </ul>

      <AppPagination
        v-if="!errorMessage"
        :pagination="pagination"
        :isSelectable="false"
        @switchPagination="switchPagination"
      />
    </div> -->
  </div>

  <!-- <AppSnackbar
    v-if="errorMessage"
    :message="errorMessage"
    buttonText="To first page"
    type="error"
    @snackClickhandler="switchPagination(1)"
  /> -->
</section>

</template>

<script lang="ts">

import { defineComponent } from 'vue'
// import { useStore } from 'vuex'
// import { useRoute, useRouter } from 'vue-router'
// import { formatDates } from '@/helpers/formatters'
// import AppPreloader from '@/components/AppPreloader.vue'
// import AppCardWrapper from '@/components/AppListCard/AppCardWrapper.vue'
// import AppCardNews from '@/components/AppListCard/AppCardNews.vue'
// import AppPagination from '@/components/AppPagination.vue'
// import AppSnackbar from '@/components/AppSnackbar.vue'

export default defineComponent({
  // components: {
  //   AppPreloader,
  //   AppCardWrapper,
  //   AppCardNews,
  //   AppPagination,
  //   AppSnackbar
  // },

  setup() {
    // const store = useStore()
    // const route = useRoute()
    // const router = useRouter()

    // const page = ref(route.query.p || 1)

    // if (!route.query.p) {
    //   router.push({ query: { p: page.value } })
    // }

    // const topNews = computed(() => store.getters.topNews)
    // const allNews = computed(() => store.getters.allNews)
    // const errorMessage = computed(() => store.getters.errorMessage)
    // const pagination = computed(() => (
    //   {
    //     page: Number(page.value),
    //     totalPages: Infinity
    //   }
    // ))

    // const readableDate = (dates) => formatDates(dates)

    // const switchPagination = (value) => {
    //   page.value = value
    //   router.push({ query: { p: page.value } })
    //   store.commit('setNews', [{}])
    //   store.dispatch('fetchNews', page.value)
    // }
    
    // if (!allNews.value.length) {
    //   store.dispatch('fetchNews', page.value)
    // }

    // return {
    //   topNews,
    //   allNews,
    //   errorMessage,
    //   readableDate,
    //   pagination,
    //   switchPagination
    // }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.hero {
  background-color: $accent;
  display: block;
  overflow: hidden;

  &__placeholder {
    height: inherit;
    width: 100%;

    .preloader {
      height: inherit;
      position: relative;
    }
  }

  &__wrapper {
    height: inherit;
    position: relative;
  }

  &__content {
    width: 55%;
    height: 100%;
    padding: 25px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;

    &-header {
      color: $border;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
      font-size: 12px;
      margin-bottom: 5px;
    }

    &-title {
      font-weight: 600;
      font-size: 26px;
      color: $white;
      margin-bottom: 10px;

      &::first-letter {
        text-transform: uppercase;
      }
    }

    &-description {
      color: $border;
      margin-bottom: 16px;
      max-height: 60px;
      overflow: hidden;
    }

    &-link {
      background-color: $white;
      color: $accent;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      border-radius: 5px;
      text-decoration: none;
      font-size: 12px;
      text-transform: uppercase;
      height: 35px;
      font-weight: 600;
      align-self: flex-start;
    }
  }

  &__cover {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 70%;
    z-index: 1;

    &:before {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background: linear-gradient(to left, transparent -20%, #{$accent} 100%);
    }

    &-image {
      height: 100%;
      width: 100%;
      display: block;
      object-fit: cover;
    }
  }
}

.news {
  padding: 25px 15px;

  &__list {
    column-count: 4;
    column-gap: 0;
    margin-bottom: 25px;

    .card {
      width: auto;
      break-inside: avoid;
      display: grid;
      grid-template-rows: 1fr auto;
    }
  }
}

</style>
