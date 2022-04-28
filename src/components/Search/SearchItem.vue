<template>
  
<li class="search__item">
  <!-- <a
    :href="`/${slug}/${item._id}`"
    class="search__link"
  > -->
  <router-link
    :to="{ path: `/${slug}/${item._id}` }"
    class="search__link"
  >
    <img
      :src="itemCover"
      :alt="item.title"
      class="search__image"
    />

    <div class="search__info">
      <strong>{{ item.title }}</strong>
      <span v-if="section === 'albums' || section === 'frames'">
        {{ item.artist.title }},
        {{ item.releaseYear }} /
        {{ item.genre.title }}
      </span>
    </div>
  </router-link>
  <!-- </a> -->
</li>

</template>

<script lang="ts">

import { defineComponent, computed, reactive } from 'vue'

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true
    },

    slug: {
      type: String,
      required: true
    },

    section: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const coverInSections = reactive({
      albums: props.item.albumCover,
      frames: '/img/frame.webp',
      artists: props.item.avatar || props.item.poster || '/img/artist.webp',
      genres: props.item.avatar || props.item.poster || '/img/genre.webp',
      periods: props.item.avatar || props.item.poster || '/img/period.webp'
    })

    const itemCover = computed(() => {
      // coverInSections[props.section]
    })

    return {
      itemCover
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.search {

  &__item {
    margin-bottom: 5px;
    border-radius: 3px;
    padding: 5px;
    transition: background-color 0.3s ease;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      background-color: $border;
      transition: background-color 0.3s ease;
    }
  }

  &__link {
    display: flex;
    align-items: center;
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
