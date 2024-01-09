<template>
  <section class="section">
    <transition name="fade">
      <Preloader
        v-if="!isDataFetched || !album._id"
        mode="light"
      />
    </transition>
    <transition name="fade">
      <div v-if="isDataFetched && album._id" class="album">
        <slot name="hero"></slot>
        <div class="album__content">
          <div
            class="album__main"
            :style="{ marginTop: 'tracks' in album ? 0 : '-300px' }"
          >
            <TrackList
              v-if="'tracks' in album"
              :tracks="album.tracks"
              :albumID="album._id"
              :artist="album.artist"
            />
            <slot
              v-else
              name="frame"
            ></slot>
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
              {{ lang('moreOf') }} {{ name }}
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

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { BookletSlideState, RelatedAlbums } from '~/types/Album'
import { DiscogsFilter, DiscogsTablePayload } from '~/types/Discogs'
import { useLocales } from '~/hooks/useLocales'
import BookletState from '~/classes/BookletState'
import AlbumPage from '~/classes/AlbumPage'
import EmbeddedItem from '~/classes/EmbeddedItem'
import Preloader from '~/components/Preloader.vue'
import AdapterCard from '~/components/Cards/AdapterCard.vue'
import TrackList from '~/components/TrackList/TrackList.vue'
import Table from '~/components/Table.vue'
import Sprite from '~/components/Sprite/Sprite.vue'
import Button from '~/components/Button.vue'

export default defineComponent({
  name: 'AlbumPageTemplate',
  components: {
    Preloader,
    AdapterCard,
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
      type: Object as PropType<AlbumPage | EmbeddedItem>,
      required: true
    },
    booklet: {
      type: Object as PropType<BookletState>,
      required: false
    },
    discogsTablePayload: {
      type: Object as PropType<DiscogsTablePayload>,
      required: false
    },
    discogsFilters: {
      type: Object as PropType<DiscogsFilter>,
      required: false
    },
    discogsFiltersStates: {
      type: Object as PropType<Record<keyof DiscogsFilter, null | string>>,
      required: false
    },
    relatedAlbums: {
      type: Array as PropType<RelatedAlbums[]>,
      requried: false
    }
  },
  setup(_, { emit }) {
    const { lang } = useLocales()    

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

    return {
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
