<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!isDataFetched"
        mode="light"
      />
    </transition>
    <transition-group name="flyUp">
      <Header :heading="pageHeading">
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
      <PagePagination
        v-if="pagePagination && pagePagination.totalPages > 1"
        key="pagination"
        :pagination="pagePagination"
        @switchPagination="switchPagination"
      />
    </transition-group>
  </section>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { BasicEntity, Pagination } from '~/types/Global'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import Header from '~/components/Header/Header.vue'
import CardList from '~/components/CardList/CardList.vue'
import Card from '~/components/Cards/Card.vue'
import PagePagination from '~/components/Pagination/Pagination.vue'

export default defineComponent({
  name: 'ListPageTemplate',
  components: {
    AppPreloader,
    Header,
    CardList,
    Card,
    PagePagination
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
    }
  }
})
</script>
