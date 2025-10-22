<template>
  <transition name="fade">
    <Loader
      v-if="isFetching"
      mode="light"
    />
  </transition>
  <ul
    v-if="isFetched && !!genres?.docs.length"
    class="toy-genres"
  >
    <TOYGenreCard
      v-for="genre in genres.docs"
      :key="genre.id"
      :card="genre"
      rootPath="toy"
    />
  </ul>
  <div v-else-if="isFetched && !genres?.docs.length">
    {{ localize('toy.emptyGenres') }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TOYGenreCard } from '~entities/toy'
import { Loader } from '~shared/UI'
import { useLocalization, useGetList } from '~shared/model'
import { DatabaseService } from '~shared/api'
import type { CloudEntity, UseEntityListPayload } from '~shared/lib'

const dbService = new DatabaseService()

const { localize } = useLocalization()

const genresConfig = computed<UseEntityListPayload>(() => ({
  entityKey: 'toy',
  requestConfig: {
    path: 'MelodyMap/TOY',
    limit: 100,
    page: 1,
    sort: { name: 1 }
  }
}))

const { data: genres, isFetching, isFetched } = useGetList<CloudEntity>(genresConfig, dbService)
</script>

<style lang="scss" scoped>
@use '~app/styles/variables' as var;

.toy-genres {

  @include var.media('<desktop') {
    margin-top: 4rem;
    padding: 0 var.$minPadding var.$mainPadding;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @include var.media('>=desktop') {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    height: 100%;
    padding: var.$mainPadding;
  }
}
</style>
