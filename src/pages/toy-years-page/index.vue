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
        :label="localize('player.waveButton')"
        :disabled="!waveTracks?.length"
        isInverted
        @click="() => playTrack(waveTracks[0])"
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
import { computed, watchEffect, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Header } from '~widgets/header'
import { TOYYearCard } from '~entities/toy'
import { Loader, Button } from '~shared/UI'
import { useGetList, useLocalization } from '~shared/model'
import { usePlaylistService } from '~features/player'
import { useWaving } from '~features/waving'
import { usePlayer } from '~features/player'
import { DatabaseService } from '~shared/api'
import type { CloudEntity, UseEntityListPayload } from '~shared/lib'

const route = useRoute()
const dbService = new DatabaseService()
const heading = computed(() => String(route.params.genre))

const yearsConfig = computed<UseEntityListPayload>(() => ({
  entityKey: 'toy',
  requestConfig: {
    path: `MelodyMap/TOY/${encodeURIComponent(String(route.params.genre))}`,
    limit: 100,
    page: 1,
    sort: { name: 1 }
  }
}))

const { localize } = useLocalization()
const { data: years, isFetching, isFetched } = useGetList<CloudEntity>(yearsConfig, dbService)
const { playTrack } = usePlayer()
const { initWavePlaylist } = usePlaylistService()
const { fetchWaving, waveTracks } = useWaving(dbService, 'toy/wave')

watchEffect(() => {
  if (waveTracks.value.length) {
    initWavePlaylist(waveTracks.value)
  }
})

onMounted(() => {
  fetchWaving(['toy', encodeURIComponent(String(route.params.genre))])
})
</script>

<style lang="scss">
@use '~/app/styles/variables' as var;

.toy-years {

  @include var.media('<desktop') {
    padding-top: var.$doublePadding;
  }

  .header {

    @include var.media('<desktop') {
      display: flex;
      flex-direction: column;
      gap: var.$minPadding;

      & > * {
        margin: 0;
        text-align: center;
      }
    }
  }

  .button {

    &.--rounded {
      @include var.media('<desktop') {
        order: -1;
        margin-bottom: var.$basicPadding;
      }
    }

    @include var.media('>=desktop') {
      margin-left: var.$mainPadding;
    }
  }

  &__list {
    padding: var.$mainPadding;
    display: grid;
    gap: 1rem;

    @include var.media('<desktop') {
      grid-template-columns: repeat(3, 1fr);

      @include var.media('landscape') {
        grid-template-columns: repeat(5, 1fr);
      }
    }

    @include var.media('>=desktop') {
      grid-template-columns: repeat(8, 1fr);
    }

    @include var.media('>=desktop-md') {
      grid-template-columns: repeat(10, 1fr);
    }
  }
}
</style>
