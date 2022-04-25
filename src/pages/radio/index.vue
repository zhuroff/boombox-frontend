<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!stations.isFetched"
        mode="light"
      />
    </transition>

    <div id="scrollspace">
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
          class="cardlist --saved"
          key="saved"
        >
          <!-- <AppCardWrapper
            v-for="(station, index) in stations.saved"
            :key="index"
            :isActive="playingTrack.fileid === station.stationuuid && !station.preloader"
          >
            <AppCardRadio
              :station="station"
              :current="playingTrack"
              :genre="activeGenre"
              :isSaved="true"
              @playStation="playStation"
              @fetchByGenre="setNewGenre"
              @removeStationFromDatabase="removeStationFromDatabase"
            />
          </AppCardWrapper> -->
        </ul>

        <ul
          v-if="stations.isFetched"
          class="stations"
          key="all"
        >
          <CardWrapper
            v-for="station in stations.data.get('all')"
            :key="station.stationuuid"
          >
            {{station.name}}
          </CardWrapper>
          <!-- <AppCardWrapper
            v-for="(station, index) in filteredStations"
            :key="index"
            :isActive="playingTrack.fileid === station.stationuuid && !station.preloader"
          >
            <AppCardRadio
              :station="station"
              :current="playingTrack"
              :genre="activeGenre"
              @playStation="playStation"
              @fetchByGenre="setNewGenre"
              @saveStationToDatabase="saveStationToDatabase"
            />
          </AppCardWrapper> -->
        </ul>
      </transition-group>
    </div>
  </section>      
</template>

<script lang="ts">

import { defineComponent, onMounted, ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '~/store'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import Button from '~/components/Button/Button.vue'
import CardWrapper from '~/components/Cards/CardWrapper.vue'
import axios from 'axios'
// import { albumsPlaceholder } from '@/helpers/modules'
// import AppCardRadioGenre from '@/components/AppListCard/AppCardRadioGenre.vue'
// import AppCardWrapper from '@/components/AppListCard/AppCardWrapper.vue'
// import AppCardRadio from '@/components/AppListCard/AppCardRadio.vue'
import RadioServices from '~/services/RadioServices'
import { RadioPage, RadioStationResponse } from '~/types/Radio'

export default defineComponent({
  components: {
    AppPreloader,
    Button,
    CardWrapper
    // AppCardRadioGenre,
    // AppCardWrapper,
    // AppCardRadio
  },

  setup() {
    const store = useStore(key)
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

    const playingTrack = computed(() => store.getters.playingTrack)

    const filteredStations = reactive(computed(() => {
      // if (!dbStations.length) {
      //   //return stations.value
      // }

      // // return stations.value.filter((el: any) => {
      // //   if (dbStations.some((s: any) => s.stationuuid === el.stationuuid)) {
      // //     return false
      // //   }

      // //   return el
      // // })
    }))

    const playStation = (payload: any) => (
      store.dispatch('playStation', payload)
    )

    const sortByVotes = (data: any) => data.sort((a: any, b: any) => {
      if (a.votes < b.votes) return 1
      if (a.votes > b.votes) return -1
      return 0
    })

    const filterByProp = (data: any) => {
      // const existing = {}
      // const result = data.filter(({ name }) => {
      //   const reducedName = name.replace(/\s/g, '').toLowerCase()
      //   if (existing[reducedName]) {
      //     return false
      //   }

      //   existing[reducedName] = true
      //   return true
      // })

      // return result
    }

    const setExtStations = (data: any) => {
      // stations.value = sortByVotes(filterByProp(data))
    }

    const setNewGenre = (genre: string) => {
      activeGenre.value = genre
      stations.isFetched = false
      router.push({ query: { p: genre } })
      fetchAllStations()
    }

    const saveStationToDatabase = async (payload: any) => {
      console.log(payload)
      // try {
      //   await axios.post('/api/stations', payload)
      //   // dbStations.push(payload)
      // } catch (error) {
      //   console.dir(error)
      // }
    }

    const removeStationFromDatabase = async (payload: any) => {
      // const targetStationIndex = dbStations.findIndex((el: any) => (
      //   el.stationuuid === payload.stationuuid
      // ))

      // if (targetStationIndex > -1) {
      //   try {
      //     const response = await axios.delete(`/api/stations/${payload.stationuuid}`)
      //     console.log(response)
      //     dbStations.splice(targetStationIndex, 1)
      //   } catch (error) {
      //     console.dir(error)
      //   }
      // }
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

.genres {
  display: flex;
  flex-wrap: wrap;
  padding: 25px;

  .button {
    margin-right: 5px;
  }
}

.stations {
  column-count: 2;
  column-gap: 10px;
  display: block;
  padding: 25px;

  &.--saved {
    min-height: auto;
    // box-shadow: inset 0 0 20px $skeleton;
    padding-bottom: 10px;
  }

  .card {
    width: 100%;
    display: grid;
    grid-template-rows: 1fr auto;
    break-inside: avoid;
  }
}

.genrelist {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 25px;
  position: sticky;
  top: 0;
  background-color: $white;
  z-index: 10;
}

</style>
