<template>
  <section class="template">
    <transition name="fade">
      <Preloader
        v-if="!isDataFetched || !album._id"
        mode="light"
      />
    </transition>
    <transition name="fade">
      <div v-if="isDataFetched && album._id" class="album">
        <slot name="hero">
          <slot name="frame"></slot>
        </slot>
        <div class="album__content">
          <div
            class="album__main"
            ref="albumContent"
          >
            <TrackList
              v-if="'tracks' in album"
              :tracks="album.tracks"
              :albumID="album._id"
              :isTOY="isTOY"
              :isCompilation="isCompilation"
              @trackOrderChanged="changeTracksOrder"
              @removeTrackFromCompilation="removeTrackFromCompilation"
            />
            <div
              v-if="discogsTablePayload?.isFetched && discogsFiltersStates"
              class="album__discogs"
            >
              <div class="album__discogs-header">
                <Sprite name="discogs" />
                <Button
                  v-if="Object.values(discogsFiltersStates).some((filter) => filter)"
                  label="Reset filters"
                  @click="resetDiscogsFilters"
                />
              </div>
              <Table
                :tableState="discogsTablePayload"
                :tableFilters="discogsFilters"
                :tableFiltersState="discogsFiltersStates"
                localeKey="discogsTable"
                @switchPagination="switchPagination"
                @update:filter="updateDiscogsFilter"
              />
            </div>
          </div>
          <div
            v-for="{ name, docs } in relatedAlbums?.filter(({ docs }) => docs.length)"
            class="album__related"
          >
            <div class="album__related-title">
              {{ localize('moreOf') }} {{ name }}
            </div>
            <AdapterCard
              v-for="item in docs"
              :key="item._id"
              :card="item"
              :isDraggable="false"
              placeholderImage="/img/album.webp"
            />
          </div>
        </div>
      </div>
    </transition>
    <slot name="modal"></slot>
  </section>
</template>

<script setup lang="ts">
import { nextTick, ref, watchEffect } from 'vue'
import type { Ref } from 'vue'
import type { RelatedAlbums, RelatedCompilations } from '~/types/Album'
import type { DiscogsFilter, DiscogsTablePayload } from '~/types/Discogs'
import type { TrackRes } from '~/types/ReqRes'
import useGlobalStore from '~/store/global'
import BookletState from '~/classes/BookletState'
import AlbumPage from '~/classes/AlbumPage'
import EmbeddedItem from '~/classes/EmbeddedItem'
import Preloader from '~/components/Preloader.vue'
import AdapterCard from '~/components/Cards/AdapterCard.vue'
import TrackList from '~/components/TrackList/TrackList.vue'
import Table from '~/components/Table.vue'
import Sprite from '~/components/Sprite/Sprite.vue'
import Button from '~/components/Button.vue'
import CompilationPage from '~/classes/CompilationPage'

interface Props {
  isDataFetched: boolean
  album: AlbumPage | EmbeddedItem | CompilationPage<TrackRes>
  booklet?: BookletState
  discogsTablePayload?: DiscogsTablePayload
  discogsFilters?: DiscogsFilter
  discogsFiltersStates?: Record<keyof DiscogsFilter, null | string>
  relatedAlbums: Array<RelatedAlbums | RelatedCompilations>
  isCompilation?: boolean
  isTOY?: boolean
}

interface Emits {
  (e: 'filter:reset'): void
  (e: 'filter:update', payload: [keyof DiscogsFilter, string | null]): void
  (e: 'switchPagination', page: number): void
  (e: 'trackOrderChanged', payload: ReorderPayload): void
  (e: 'removeTrackFromCompilation', payload: GatheringUpdateReq): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { globalGetters: { localize } } = useGlobalStore()
const albumContent: Ref<null | HTMLInputElement> = ref(null)

const updateDiscogsFilter = (payload: [keyof DiscogsFilter, string | null]) => {
  emit('filter:update', payload)
}

const switchPagination = (page: number) => {
  emit('switchPagination', page)
}

const resetDiscogsFilters = () => {
  emit('filter:reset')
}

// const closeBookletModal = () => {
//   emit('closeBookletModal')
// }

// const bookletPageChanged = (data: BookletSlideState) => {
//   emit('bookletPageChanged', data)
// }

const changeTracksOrder = (payload: ReorderPayload) => {
  emit('trackOrderChanged', payload)
}

const removeTrackFromCompilation = (payload: GatheringUpdateReq) => {
  emit('removeTrackFromCompilation', payload)
}

watchEffect(() => {
  if (!('frame' in props.album)) return

  nextTick(() => {
    const frameHeight = document.querySelector('iframe')?.clientHeight
    const heroHeight = document.querySelector('.album__hero')?.clientHeight

    if (!frameHeight || !heroHeight || Number(frameHeight) <= Number(heroHeight)) return

    if (albumContent.value) {
      const contentMargin = frameHeight - heroHeight + 50
      albumContent.value.style.marginTop = `${contentMargin}px`
    }
  })
})
</script>

<style lang="scss">
@import '../scss/variables.scss';
@import 'include-media';

.album {
  flex: 1 1 0;
  position: relative;

  &__content {
    flex: 1 1 0;
    padding: 25px;
    position: relative;

    @include media('<laptop') {
      border-top-left-radius: 25px;
      border-top-right-radius: 25px;
      margin-top: 100vw;
      background-color: $white;
    }

    @include media('>=laptop') {
      display: grid;
      grid-template-columns: calc(100% - 252px - 252px - 25px - 25px) 252px 252px;
      gap: 25px;
    }
  }

  &__main {
    position: relative;
  }

  &__frame {
    position: relative;
    margin-bottom: 25px;
    width: $coverWidth;
  }

  &__related {

    @include media('<laptop') {
      margin-bottom: 25px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    &-title {
      font-weight: 600;
      text-align: center;

      @include media('>=laptop') {
        margin-bottom: 1rem;
      }
    }
  }

  &__discogs {

    @include media('<laptop') {
      display: none;
    }

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;

      .discogs {
        width: 100px;
        height: auto;
      }
    }
  }
}
</style>
