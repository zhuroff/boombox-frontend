<template>

<section class="section">
  <transition name="fade">
    <AppPreloader
      v-if="!isFetched"
      mode="light"
    />
  </transition>

  <transition-group name="flyUp">
    <div class="hero" key="hero">
      <div
        v-if="isFetched"
        class="hero__wrapper"
      >
        <div class="hero__content">
          <time class="hero__content-header">
            {{ topNews.dates }}
          </time>
          <div class="hero__content-title">{{ topNews.title }}</div>
          <div class="hero__content-description">{{ topNews.description }}</div>
          <a
            :href="topNews.siteUrl"
            target="_blank"
            class="hero__content-link"
          >Read more</a>
        </div>
        
        <div class="hero__cover">
          <img
            :src="topNews.imageUrl"
            :alt="topNews.title"
            class="hero__cover-image"
          >
        </div>
      </div>
    </div>

    <div
      v-if="isFetched"
      class="news"
      key="events"
    >
      <ul
        v-if="restNews.length"
        class="news__list"
      >
        <CardWrapper
          v-for="item in restNews"
          :key="item.id"
        >
          <CardNews :item="item" />
        </CardWrapper>
      </ul>

      <Pagination
        v-if="isFetched && pagination.totalPages > 1"
        :pagination="pagination"
        key="pagination"
        @switchPagination="switchPagination"
      />
    </div>
  </transition-group>
</section>

</template>

<script lang="ts">

import { defineComponent, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TPagination, RequestConfig } from '~/types/Global'
import { NewsPage, NewsPageResponse } from '~/types/News'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import CardWrapper from '~/components/Cards/CardWrapper.vue'
import CardNews from '~/components/Cards/CardNews.vue'
import Pagination from '~/components/Pagination/Pagination.vue'
import NewsServices from '~/services/NewsServices'

export default defineComponent({
  components: {
    AppPreloader,
    CardWrapper,
    CardNews,
    Pagination
  },

  setup() {
    const route = useRoute()
    const router = useRouter()

    const pageConfig = reactive<RequestConfig>({
      page: Number(route.query.p) || 1,
      sort: { title: 1 },
      limit: 33
    })

    const news = reactive({
      isFetched: false,
      data: [] as NewsPage[],
      pagination: {} as TPagination
    })

    const isFetched = computed(() => news.isFetched)
    const topNews = computed(() => news.data[0])
    const restNews = computed(() => news.data.filter((_, index) => index > 0))
    const pagination = computed(() => news.pagination)

    const switchPagination = (value: number) => {
      news.isFetched = false
      pageConfig.page = value
      router.push({ query: { p: value } })
      fetchNews()
    }

    const setFetchedData = (data: NewsPageResponse) => {
      news.pagination = data.pagination
      news.data = data.docs
      news.isFetched = true
    }

    const fetchNews = async () => {
      NewsServices.list(pageConfig)
        .then((events) => setFetchedData(events))
        .catch((ignore) => ignore)   
    }

    const changeRoutePage = (value: number) => {
      router.push({ query: { p: value } })
    }
    
    onMounted(() => {
      if (!route.query.p) {
        changeRoutePage(pageConfig.page)
      }

      fetchNews()
    })

    return {
      isFetched,
      topNews,
      restNews,
      pagination,
      switchPagination
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';
@import 'include-media';

.hero {
  background-color: $accent;
  display: block;
  overflow: hidden;

  @include media('<laptop') {
    height: 100vh;
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
  padding: 25px 15px 0;

  &__list {

    @include media('<tablet', 'landscape') {
      column-count: 2;
      column-gap: 0;
    }

    @include media('>=tablet') {
      column-count: 2;
      column-gap: 0;
      margin-bottom: 25px;
    }

    @include media('>=desktop') {
      column-count: 4;
    }

    .card {
      width: auto;
      break-inside: avoid;
      display: grid;
      grid-template-rows: 1fr auto;
    }
  }
}

</style>
