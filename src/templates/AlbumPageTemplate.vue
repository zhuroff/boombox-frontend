<template>
  <section class="section">
    <transition name="fade">
      <Preloader
        v-if="!isDataFetched"
        mode="light"
      />
    </transition>
    <transition name="fade">
      <div v-if="isDataFetched" class="album">
        <div class="album__hero">
          <CoverArt
            :cover="album.coverURL"
            :booklet="booklet"
            @coverClick="getBooklet"
            @closeBookletModal="closeBookletModal"
            @slideChanged="bookletPageChanged"
          />
          <slot></slot>
        </div>
        <div class="album__content">
          <div class="album__main">
            <TrackList
              :tracks="album.tracks"
              :albumID="album._id"
              :artist="album.artist"
            />
            <div
              v-if="discogsTablePayload.isFetched"
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
            v-if="relatedAlbums.get('artists')?.length"
            class="album__related"
          >
            <div class="album__related-title">
              {{ lang('moreOf') }} {{ album.artist.title }}
            </div>
            <Card
              v-for="item in relatedAlbums.get('artists')"
              :key="item._id"
              :card="item"
              type="CardBox"
              rootPath="albums"
              className="card-box"
              placeholderImage="/img/album.webp"
            />
          </div>
          <div 
            v-if="relatedAlbums.get('genres')?.length"
            class="album__related"
          >
            <div class="album__related-title">
              {{ lang('moreOf') }} {{ album.genre.title }}
            </div>
            <Card
              v-for="item in relatedAlbums.get('genres')"
              :key="item._id"
              :card="item"
              type="CardBox"
              rootPath="albums"
              className="card-box"
              placeholderImage="/img/album.webp"
            />
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script lang="ts">
import { PropType, defineComponent, computed, watchEffect } from 'vue'
import { AlbumPage, BookletSlideState } from '~/types/Album'
import { DiscogsFilter, DiscogsTablePayload } from '~/types/Discogs'
import { RequestFilter } from '~/types/Global'
import { BookletState } from '~/states/BookletState'
import { useAlbumPage } from '~/hooks/useAlbumPage'
import { useLocales } from '~/hooks/useLocales'
import Preloader from '~/components/Preloader.vue'
import CoverArt from '~/components/CoverArt.vue'
import Card from '~/components/Cards/Card.vue'
import TrackList from '~/components/TrackList/TrackList.vue'
import Table from '~/components/Table.vue'
import Sprite from '~/components/Sprite/Sprite.vue'
import Button from '~/components/Button.vue'

export default defineComponent({
  name: 'AlbumPageTemplate',
  components: {
    Preloader,
    CoverArt,
    Card,
    TrackList,
    Table,
    Sprite,
    Button
  },
  props: {
    isDataFetched: {
      type: Boolean,
      required: true
    },
    album: {
      type: Object as PropType<AlbumPage>,
      required: true
    },
    booklet: {
      type: Object as PropType<BookletState>,
      required: true
    },
    discogsTablePayload: {
      type: Object as PropType<DiscogsTablePayload>,
      required: true
    },
    discogsFilters: {
      type: Object as PropType<DiscogsFilter>,
      required: true
    },
    discogsFiltersStates: {
      type: Object as PropType<Record<keyof DiscogsFilter, null | string>>,
      required: true
    },
    entityType: {
      type: String,
      required: true
    },
    getBooklet: {
      type: Function as PropType<() => void>,
      required: true
    }
  },
  setup({ album, entityType }, { emit }) {
    const {
      getRelatedAlbums,
      relatedEntities,
    } = useAlbumPage<AlbumPage>()
    const { lang } = useLocales()
    const relatedAlbums = computed(() => relatedEntities)

    const getRelated = () => {
      const relatedAlbumsConfig: RequestFilter[] = [
        {
          from: 'artists',
          key: 'artist._id',
          value: album.artist._id,
          excluded: {
            _id: album._id
          }
        },
        {
          from: 'genres',
          key: 'genre._id',
          value: album.genre._id,
          excluded: {
            _id: album._id,
            'artist._id': album.artist._id
          }
        }
      ]

      relatedAlbumsConfig.forEach((config) => {
        getRelatedAlbums(config, entityType)
      })
    }

    const updateDiscogsFilter = (payload: [keyof DiscogsFilter, string]) => {
      emit('filter:update', payload)
    }

    const switchPagination = (page: number) => {
      emit('switchPagination', page)
    }

    const resetDiscogsFilters = () => {
      emit('filter:reset')
    }

    const closeBookletModal = () => {
      emit('closeBookletModal')
    }

    const bookletPageChanged = (data: BookletSlideState) => {
      emit('bookletPageChanged', data)
    }
    
    watchEffect(() => album._id && getRelated())

    return {
      relatedAlbums,
      updateDiscogsFilter,
      resetDiscogsFilters,
      switchPagination,
      closeBookletModal,
      bookletPageChanged,
      lang
    }
  }
})
</script>

<style lang="scss">
@import '../scss/variables.scss';
@import 'include-media';

.album {
  flex: 1 1 0;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 265px;
    background-color: $dark;
    left: 0;
    top: 0;
    z-index: -1;
  }

  @include media('>=laptop') {
    padding: 25px 25px 0;
  }

  &__hero {

    @include media('<laptop') {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vw;
    }

    @include media('>=laptop') {
      position: relative;
      display: grid;
      grid-template-columns: 300px 1fr;
    }
  }

  &__content {
    flex: 1 1 0;

    @include media('<laptop') {
      padding: 25px;
      border-top-left-radius: 25px;
      border-top-right-radius: 25px;
      margin-top: 100vw;
      background-color: $white;
      position: relative;
      z-index: 10;
    }

    @include media('>=laptop') {
      display: grid;
      grid-template-columns: calc(100% - 252px - 252px - 25px - 25px) 252px 252px;
      gap: 25px;
    }
  }

  &__related {

    &-title {
      font-weight: 600;
      text-align: center;
      margin-bottom: 1rem;
    }
  }

  &__discogs {

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;

      .discogs {
        width: 100px;
        height: auto;
      }
    }
  }
}
</style>
~/states/BookletState