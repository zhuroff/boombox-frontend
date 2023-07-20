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
        <Dropdown
          :options="sortOptions"
          @chooseItem="setSorting"
        />
      </Header>
      <CardList
        v-if="isDataFetched"
        key="list"
      >
        <Card
          v-for="card in albumList"
          :key="card._id"
          :card="card"
          type="CardBox"
          rootPath="albums"
          className="card-box"
        />
      </CardList>
      <PagePagination
        v-if="pagePagination?.totalPages > 1"
        key="pagination"
        :pagination="pagePagination"
        @switchPagination="switchPagination"
      />
    </transition-group>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { AlbumPageResponse, AlbumItem } from '~/types/Album'
import { Pagination, RequestConfig, DropdownOption, SortingValue, CardBasic } from '~/types/Global'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import Header from '~/components/Header/Header.vue'
import Dropdown from '~/components/Dropdown/Dropdown.vue'
import CardList from '~/components/CardList/CardList.vue'
import Card from '~/components/Cards/Card.vue'
import PagePagination from '~/components/Pagination/Pagination.vue'
import DBApiService from '~/services/DBApiService'

export default defineComponent({
  components: {
    AppPreloader,
    Header,
    Dropdown,
    CardList,
    Card,
    PagePagination
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const isDataFetched = ref(false)
    const albums = reactive<AlbumItem[]>([])
    const pagePagination = ref<Pagination>(null!)

    const pageConfig = reactive<RequestConfig>({
      page: Number(route.query.p) || 1,
      sort: { title: 1 },
      limit: 40
    })

    let sortOptions = ref<DropdownOption<SortingValue>[]>([
      {
        title: 'Title ASC',
        value: { title: 1 },
        isActive: true
      },

      {
        title: 'Title DESC',
        value: { title: -1 },
        isActive: false
      },

      {
        title: 'Created ASC',
        value: { dateCreated: 1 },
        isActive: false
      },

      {
        title: 'Created DESC',
        value: { dateCreated: -1 },
        isActive: false
      }
    ])

    const pageHeading = computed(() => (
      `The collection contains ${pagePagination.value?.totalDocs || 0} albums`
    ))

    const albumList = computed<CardBasic[]>(() => (
      albums.map((album) => ({
        _id: album._id,
        title: album.title,
        coverURL: `${album.albumCover}`,
        caption: `${album.artist.title }, ${album.period.title} / ${album.genre.title}`,
      }))
    ))

    const setSorting = (value: SortingValue) => {
      sortOptions.value = sortOptions.value.map((option) => (
        { ...option, isActive: JSON.stringify(option.value) === JSON.stringify(value) }
      ))

      pageConfig.sort = value

      cleanPageData()
      fetchAlbums()
    }

    const cleanPageData = () => {
      albums.length = 0
      isDataFetched.value = false
    }

    const changeRoutePage = (value: number) => {
      router.push({ query: { p: value } })
    }

    const switchPagination = (value: number) => {
      pageConfig.page = value

      cleanPageData()
      changeRoutePage(value)
      fetchAlbums()
    }

    const fetchAlbums = () => {
      DBApiService.getEntityList<AlbumPageResponse>(pageConfig)
        .then(({ docs, pagination }) => {
          albums.push(...docs)
          pagePagination.value = pagination
          isDataFetched.value = true
        })
        .catch(console.error)
    }

    onMounted(() => {
      if (!route.query.p) {
        changeRoutePage(pageConfig.page)
      }

      fetchAlbums()
    })

    return {
      pageHeading,
      albumList,
      pagePagination,
      isDataFetched,
      sortOptions,
      setSorting,
      switchPagination
    }
  }
})
</script>
