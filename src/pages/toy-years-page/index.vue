<template>
  <transition name="fade">
    <Loader
      v-if="isFetching"
      mode="light"
    />
  </transition>
  <div
    v-if="isFetched && !!years?.docs.length"
    class="toy-years"
  >
    <Header
      :heading="heading || ''"
      :withSearch="false"
    >
      <Button
        size="medium"
        label="player.waveButton"
        :disabled="!waveAlbum?.tracks?.length"
        @click="playWave"
      />
    </Header>
    <ul class="toy-years__list">
      <TOYYearCard
        v-for="year in years.docs"
        :key="year.id"
        :card="year"
        :rootPath="`toy/${(heading || '')}`"
      />
    </ul>
  </div>
  <div v-else-if="isFetched && !years?.docs.length">
    {{ localize('toy.emptyYears') }}
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Header } from '~widgets/header'
import { TOYYearCard } from '~entities/toy'
import { Loader, Button } from '~shared/UI'
import { useGetList } from '~shared/model'
import { DatabaseService } from '~shared/api'
import useGlobalStore from '~/store/global'
import type { CloudEntity } from '~/types/ReqRes'

const dbService = new DatabaseService()

const route = useRoute()

const waveAlbum = ref<null | any>(null)

const heading = computed(() => String(route.params.genre))

const yearsConfig = computed(() => ({
  entityKey: 'toy',
  requestConfig: { path: `MelodyMap/TOY/${encodeURIComponent(String(route.params.genre))}` }
}))

const {
  globalGetters: { localize }
} = useGlobalStore()

const { data: years, isFetching, isFetched } = useGetList<CloudEntity>(yearsConfig, dbService)

const playWave = () => {
  console.log('playWave')
}
</script>

<style lang="scss" scoped>
.toy-years {

  &__list {
    padding: 25px;
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(10, 1fr);
  }
}
</style>
