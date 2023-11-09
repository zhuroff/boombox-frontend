<template>
  
<li class="search__item">
  <router-link
    :to="{ path: `/${slug}/${item._id}` }"
    class="search__link"
    @click="cleanSearchResults"
  >
    <img
      :src="itemCover"
      :alt="item.title"
      class="search__image"
    />

    <div class="search__info">
      <strong>{{ item.title }}</strong>
      <span v-if="slug === 'albums' || slug === 'frames'">
        {{ item.artist.title }},
        {{ item.period.title }} /
        {{ item.genre.title }}
      </span>
    </div>
  </router-link>
</li>

</template>

<script lang="ts">

import { computed, defineComponent, PropType } from 'vue'
import { SearchResultData } from '~/types/Search'
import { hostString } from '~/utils'

export default defineComponent({
  name: 'SearchResultsItem',

  props: {
    item: {
      type: Object as PropType<SearchResultData>,
      required: true
    },

    slug: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const coverPlaceholders = (slug: string) => {
      switch(slug) {
        case 'artists':
          return '/img/artist.webp'
        case 'genres':
          return '/img/genre.webp'
        case 'periods':
          return '/img/period.webp'
        case 'frames':
          return '/img/frame.webp'
        default:
          return '/img/album.webp'
      }
    }
    
    const itemCover = computed(() => {
      if ('albumCover' in props.item) {
        return props.item.albumCover
      }

      return 'avatar' in props.item
        ? hostString(props.item.avatar)
        : coverPlaceholders(props.slug)
    })

    const cleanSearchResults = () => emit('cleanSearchResults')

    return {
      itemCover,
      cleanSearchResults
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.search {

  &__item {
    border-radius: 3px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: $border;
      transition: background-color 0.3s ease;
    }
  }

  &__link {
    display: flex;
    align-items: center;
    padding: 5px 15px;
  }

  &__image {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 3px;
    flex: none;
  }

  &__info {
    margin-left: 12px;

    strong {
      font-weight: 600;
      font-size: 14px;
      display: block;
      color: $dark;
    }

    span {
      font-size: 12px;
      color: $pale;
    }
  }
}

</style>
