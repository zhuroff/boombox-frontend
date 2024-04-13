<template>
  <section class="template">
    <transition name="fade">
      <Preloader
        v-if="!isFetched"
        mode="light"
      />
    </transition>
    <transition-group name="flyUp">
      <!-- <Header
        v-if="pageHeading"
        :heading="pageHeading"
        :withSearch="withSearch"
      >
        <slot name="header"></slot>
        <slot name="under-header"></slot>
      </Header> -->
      <CardList
        v-if="isFetched && stations.get('saved')?.length"
        key="list"
      >
        <AdapterCard
          v-for="item in stations.get('saved')"
          :key="item._id"
          :card="item"
          :isDraggable="false"
          placeholderImage=""
          @deleteEntity="(payload: unknown) => $emit('deleteEntity', payload)"
        />
      </CardList>
      <CardList
        v-if="isFetched && stations.get('all')?.length"
        key="list"
      >
        <AdapterCard
          v-for="item in stations.get('all')"
          :key="item._id"
          :card="item"
          :isDraggable="false"
          placeholderImage=""
          @action:play="playStation"
        />
      </CardList>
    </transition-group>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RadioPageData } from '~/types/Radio'
import RadioCard from '~/classes/RadioCard'
import Preloader from '~/components/Preloader.vue'
import CardList from '~/components/Cards/CardList.vue'
import AdapterCard from '~/components/Cards/AdapterCard.vue'
import radioServices from '~/services/radio.services'
import store from '~/store'

export default defineComponent({
  name: 'Radio',
  components: {
    Preloader,
    CardList,
    AdapterCard
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { actions } = store

    const stations = reactive<RadioPageData>(new Map())
    const activeGenre = ref(route.query.p || 'jazz')
    const isFetched = ref(false)

    const fetchStations = async () => {
      try {
        const [savedStations, allStations] = await Promise.all([
          radioServices.get(),
          radioServices.get({ genre: String(activeGenre.value), offset: 0 })
        ])

        stations.set('saved', savedStations.map((station) => new RadioCard(station, 'RadioCard')))
        stations.set('all', allStations.map((station) => new RadioCard(station, 'RadioCard')))
      } catch (error) {
        console.error(error)
      } finally {
        isFetched.value = true
      }
    }

    const playStation = (station: RadioCard) => {
      actions.setPlayingStation(station)
    }

    onMounted(() => {
      if (!route.query.p) {
        router.push({ query: { p: activeGenre.value } })
      }

      fetchStations()
    })

    return {
      stations,
      isFetched,
      playStation
    }
  }
})
</script>
