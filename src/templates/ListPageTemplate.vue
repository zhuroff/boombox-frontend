<template>
  <section class="section">
    <transition name="fade">
      <Preloader
        v-if="!isDataFetched"
        mode="light"
      />
    </transition>
    <transition-group name="flyUp">
      <Header
        :heading="pageHeading"
        :withSearch="withSearch"
      >
        <slot name="header"></slot>
      </Header>
      <CardList
        v-if="isDataFetched"
        key="list"
      >
        <Card
          v-for="item in dataList"
          :key="item._id"
          :card="item"
          :type="cardType"
          :rootPath="rootPath"
          :className="cardClass"
          :placeholderImage="placeholderImage"
        />
      </CardList>
      <Paginator
        v-if="pagePagination && pagePagination.totalPages > 1"
        key="pagination"
        :config="paginationConfig"
        :pagination="pagePagination"
        :style="{ marginTop: 'auto' }"
        @switchPagination="switchPagination"
        @changeLimit="setEntitiesLimit"
      />
    </transition-group>
  </section>
</template>

<script lang="ts">
import { PropType, defineComponent, ref } from 'vue'
import { BasicEntity, Pagination, PaginationConfig } from '~/types/Common'
import Preloader from '~/components/Preloader.vue'
import Header from '~/components/Header.vue'
import CardList from '~/components/CardList/CardList.vue'
import Card from '~/components/Cards/Card.vue'
import Paginator from '~/components/Paginator.vue'

export default defineComponent({
  name: 'ListPageTemplate',
  components: {
    Preloader,
    Header,
    CardList,
    Card,
    Paginator
  },
  props: {
    isDataFetched: {
      type: Boolean,
      required: true
    },
    pageHeading: {
      type: String,
      required: true
    },
    dataList: {
      type: Array as PropType<BasicEntity[]>,
      required: true
    },
    cardType: {
      type: String,
      required: true
    },
    rootPath: {
      type: String,
      required: true
    },
    cardClass: {
      type: String,
      required: true
    },
    placeholderImage: {
      type: String,
      required: true
    },
    pagePagination: {
      type: Object as PropType<Pagination>,
      required: false
    },
    switchPagination: {
      type: Function as PropType<(page: number) => void>,
      required: false
    },
    setEntitiesLimit: {
      type: Function as PropType<(limit: number) => void>,
      required: false
    },
    withSearch: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup({ pagePagination }) {
    const paginationConfig = ref<PaginationConfig>({
      limiter: [12, 15, 18, 30, 45, 48, 60, 75, 78, 100, 102],
      increment: true,
      decrement: true,
      selected: pagePagination?.limit || 15
    })

    return { paginationConfig }
  }
})
</script>
