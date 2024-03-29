<template>
  <section class="section">
    <transition name="fade">
      <Preloader
        v-if="!stations.isFetched"
        mode="light"
      />
    </transition>

    <transition-group name="flyUp">
      <ul
        key="genres"
        class="genres"
      >
        <Button
          v-for="(genre, index) in genres"
          :key="index"
          :text="genre"
          :isFilled="genre === activeGenre"
          :isDisabled="!stations.isFetched"
          @onClick="setNewGenre(genre)"
        />
      </ul>

      <ul
        v-if="stations.isFetched"
        class="stations --saved"
        key="saved"
      >
        <!-- <CardWrapper
          v-for="station in stations.data.get('saved')"
          :key="station.stationuuid"
        > -->
          <!-- <CardRadio
            :station="station"
            :current="playingTrack"
            :genre="activeGenre"
            :isSaved="true"
            @playStation="playStation"
            @fetchByGenre="setNewGenre"
            @removeStationFromDatabase="removeStationFromDatabase"
          /> -->
        <!-- </CardWrapper> -->
      </ul>

      <ul
        v-if="stations.isFetched"
        class="stations"
        key="all"
      >
        <!-- <CardWrapper
          v-for="station in filteredStations"
          :key="station.stationuuid"
        > -->
          <!-- <CardRadio
            :station="station"
            :current="playingTrack"
            :genre="activeGenre"
            :isSaved="false"
            @playStation="playStation"
            @fetchByGenre="setNewGenre"
            @saveStationToDatabase="saveStationToDatabase"
          /> -->
        <!-- </CardWrapper> -->
      </ul>
    </transition-group>
  </section>      
</template>

<script lang="ts">

import { defineComponent, onMounted, ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { RadioPage, RadioStationResponse } from '~/types/Radio'
import Preloader from '~/components/Preloader.vue'
import Button from '~/components/Button/Button.vue'
// import CardWrapper from '~/components/Cards/CardWrapper.vue'
import RadioCard from '~/components/Cards/RadioCard.vue'
import RadioServices from '~/services/RadioServices'

export default defineComponent({
  components: {
    Preloader,
    Button,
    // CardWrapper,
    RadioCard
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const activeGenre = ref(route.query.p || 'jazz')
    
    const stations = reactive<RadioPage>({
      isFetched: false,
      data: new Map()
    })

    const genres = reactive([
      'jazz', 'blues', 'rock', 'indie', 'hip-hop',
      'metal', 'classical', 'electronic', 'ambient'
    ])

    const playingTrack = computed(() => false /* store.getters.playingTrack */)

    const filteredStations = computed(() => {
      if (!stations.data.get('saved')?.length) {
        return stations.data.get('all')
      }

      return stations.data.get('all')?.filter((station) => (
          !stations.data.get('saved')?.some((s: RadioStationResponse) => (
            s.stationuuid === station.stationuuid
          ))
        ))
    })

    const playStation = (payload: RadioStationResponse) => {
      // store.commit('setPlayingStation', payload)
    }

    const setNewGenre = (genre: string) => {
      activeGenre.value = genre
      stations.isFetched = false
      router.push({ query: { p: genre } })
      fetchAllStations()
    }

    const moveSavedToList = (id: string) => {
      const movedStationIndex = stations.data.get('all')?.findIndex((station: RadioStationResponse) => (
        station.stationuuid === id
      ))

      if (movedStationIndex && movedStationIndex > -1) {
        const movedStation = stations.data.get('all')?.splice(movedStationIndex, 1)

        if (movedStation) {
          stations.data.get('saved')?.push(...movedStation)
        }
      }
    }

    const removeStation = (id: string) => {
      const deletedStationIndex = stations.data.get('saved')?.findIndex((station: RadioStationResponse) => (
        station.stationuuid === id
      ))

      if (deletedStationIndex && deletedStationIndex > -1) {
        stations.data.get('saved')?.splice(deletedStationIndex, 1)
      }
    }

    const saveStationToDatabase = async (station: RadioStationResponse) => {
      const { stationuuid, name } = station

      // RadioServices.save({ stationuuid, name })
      //   .then((message) => store.commit('setSnackbarMessage', { message, type: 'success' }))
      //   .then(_ => moveSavedToList(stationuuid))
      //   .catch((error) => console.dir(error))
    }

    const removeStationFromDatabase = async (payload: RadioStationResponse) => {
      // RadioServices.remove(payload.stationuuid)
      //   .then((message) => store.commit('setSnackbarMessage', { message, type: 'success' }))
      //   .then(_ => removeStation(payload.stationuuid))
      //   .catch((error) => console.dir(error))
    }

    const radioSetter = (key: 'saved' | 'all', data: RadioStationResponse[]) => {
      stations.data.set(key, data)

      if (stations.data.size === 2) {
        stations.isFetched = true
      }
    }

    const fetchSavedStations = () => {
      RadioServices.savedStations()
        .then((data) => radioSetter('saved', data))
        .catch((error) => console.dir(error))
    }

    const fetchAllStations = async () => {
      RadioServices.allStations({ genre: String(activeGenre.value), offset: 0 })
        .then((data) => radioSetter('all', data))
        .catch((error) => console.dir(error))
    }

    onMounted(() => {
      if (!route.query.p) {
        router.push({ query: { p: activeGenre.value } })
      }

      fetchSavedStations()
      fetchAllStations()
    })

    return {
      stations,
      activeGenre,
      filteredStations,
      genres,
      playStation,
      playingTrack,
      setNewGenre,
      saveStationToDatabase,
      removeStationFromDatabase
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';
@import 'include-media';

.genres {
  display: flex;
  padding: 25px;

  @include media('<laptop') {
    width: 100%;
    overflow: auto;
  }

  @include media('>=laptop') {
    flex-wrap: wrap;
  }

  .button {
    margin-right: 5px;
  }
}

.stations {
  padding: 25px;
  display: grid;
  gap: 15px;

  @include media('>=tablet') {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @include media('>=laptop') {
    grid-template-columns: 1fr 1fr 1fr;
  }

  &.--saved {
    min-height: auto;
    background-color: $paleLT;

    @include media('<desktop') {
      padding-bottom: 25px;
    }

    @include media('>=desktop') {
      padding-bottom: 10px;
    }
  }

  .card {
    width: 100%;
    display: grid;
    grid-template-rows: 1fr auto;
  }
}

</style>
