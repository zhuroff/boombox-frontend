<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!isDataFetched"
        mode="light"
      />
    </transition>
    <transition name="fade">
      <div v-if="isDataFetched" class="album">
        <div class="album__hero">
          <CoverArt
            :albumCover="album.albumCover"
            @coverClick="getBooklet"
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
            <Table
              v-if="discogsTablePayload.isFetched"
              :tableState="discogsTablePayload"
              :tableFilters="discogsFilters"
              localeKey="discogsTable"
              @switchPagination="(page) => discogsTablePayload.set({ page })"
            />
          </div>
          <div
            v-if="relatedAlbums.get('artists')?.length"
            class="album__related"
          >
            <div class="album__related-title">More of {{ album.artist.title }}</div>
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
            <div class="album__related-title">More of {{ album.genre.title }}</div>
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
import { AlbumPage } from '~/types/Album'
import { DiscogsFilter, DiscogsTablePayload } from '~/types/Discogs'
import { RequestFilter } from '~/types/Global'
import { useAlbumPage } from '~/hooks/useAlbumPage'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import CoverArt from '~/components/CoverArt/CoverArt.vue'
import Card from '~/components/Cards/Card.vue'
import TrackList from '~/components/TrackList/TrackList.vue'
import Table from '~/components/Table.vue'

export default defineComponent({
  name: 'AlbumPageTemplate',
  components: {
    AppPreloader,
    CoverArt,
    Card,
    TrackList,
    Table
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
    discogsTablePayload: {
      type: Object as PropType<DiscogsTablePayload>,
      required: true
    },
    discogsFilters: {
      type: Object as PropType<DiscogsFilter>,
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
  setup({ album, entityType }) {
    const {
      getRelatedAlbums,
      relatedEntities,
    } = useAlbumPage<AlbumPage>()

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
    
    watchEffect(() => album._id && getRelated())

    return {
      relatedAlbums
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
      grid-template-columns: 1fr 252px 252px;
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
}
</style>
