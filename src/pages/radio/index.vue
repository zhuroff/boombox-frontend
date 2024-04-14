<template>
  <section class="template">
    <transition name="fade">
      <Preloader
        v-if="!isFetched"
        mode="light"
      />
    </transition>
    <transition-group name="flyUp">
      <Header
        :heading="pageHeading"
        :withSearch="false"
      />
      <div class="radio__genres">
        <Button
          v-for="genre in radioGenres"
          :key="genre.value.toString()"
          :label="genre.title.toString()"
          :isActive="activeGenre === genre.value.toString()"
          @click="setGenre(genre.value.toString())"
        />
      </div>
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
import { defineComponent, onMounted, computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLocales } from '~/hooks/useLocales'
import { RadioPageData } from '~/types/Radio'
import Header from '~/components/Header.vue'
import RadioCard from '~/classes/RadioCard'
import Preloader from '~/components/Preloader.vue'
import Button from '~/components/Button.vue'
import CardList from '~/components/Cards/CardList.vue'
import AdapterCard from '~/components/Cards/AdapterCard.vue'
import radioServices from '~/services/radio.services'
import locales from '~/locales'
import store from '~/store'
import { LocaleDictionary } from '~/types/Common'

export default defineComponent({
  name: 'Radio',
  components: {
    Header,
    Button,
    Preloader,
    CardList,
    AdapterCard
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { lang } = useLocales()
    const { actions, getters: { currentLocale } } = store

    const stations = reactive<RadioPageData>(new Map())
    const activeGenre = ref(route.query.p || 'jazz')
    const isFetched = ref(false)

    const pageHeading = computed(() => lang(`headings.radio`))

    const radioGenres = computed(() => {
      const dictionary = locales.get(currentLocale.value)
      if (!dictionary || typeof dictionary.radio !== 'object') {
        return []
      }
      return (
        Object.entries(dictionary.radio.genres)
          .reduce<Record<string, string | LocaleDictionary>[]>((acc, [key, value]) => {
            acc.push({ value: key, title: value })
            return acc
          }, [])
      )
    })

    const setGenre = (genre: string) => {
      activeGenre.value = genre
      router.push({ query: { p: genre } })
      fetchStations()
    }

    const fetchStations = async () => {
      isFetched.value = false
      try {
        const [savedStations, allStations] = await Promise.all([
          radioServices.get(),
          radioServices.get({ genre: String(activeGenre.value), offset: 0, limit: 60 })
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
      playStation,
      pageHeading,
      activeGenre,
      radioGenres,
      setGenre
    }
  }
})
</script>

<style lang="scss">
.radio {

  &__genres {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 25px 25px 0;
  }
}
</style>
