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
import { useGetList } from '~shared/model'
import { DatabaseService } from '~shared/api'
import { useTranslate } from '~features/localization'
import type { CloudEntity } from '~/types/ReqRes'

const dbService = new DatabaseService()

const { localize } = useTranslate()

const genresConfig = computed(() => ({
  entityKey: 'toy',
  requestConfig: { path: 'MelodyMap/TOY' }
}))

const { data: genres, isFetching, isFetched } = useGetList<CloudEntity>(genresConfig, dbService)
</script>

<style lang="scss" scoped>
.toy-genres {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  height: 100%;
  padding: 25px;
}
</style>
