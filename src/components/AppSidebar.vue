<template>
  <aside class="aside">
    <router-link
      class="aside__homelink"
      to="/"
    >
      <AppSprite name="vinyl" />
      <span>BoomBox</span>
    </router-link>

    <nav class="aside__nav">
      <ul class="aside__nav-list">
        <li
          v-for="(item, index) in navbar"
          :key="index"
          class="aside__nav-item"
        >
          <router-link
            :to="`/${item.route}`"
            class="aside__nav-link"
          >{{ item.title }}</router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script lang="ts">

import { defineComponent, reactive } from 'vue'
import AppSprite from '~/components/AppSprite.vue'

export default defineComponent({
  components: {
    AppSprite
  },

  setup() {
    const navbar = reactive([
      {
        title: 'Artists',
        route: 'artists'
      },

      // {
      //   title: 'Genres',
      //   route: 'genres'
      // },

      {
        title: 'Albums',
        route: 'albums'
      },

      // {
      //   title: 'Periods',
      //   route: 'periods'
      // },

      // {
      //   title: 'Collections',
      //   route: 'collections'
      // },

      // {
      //   title: 'Playlists',
      //   route: 'playlists'
      // },

      // {
      //   title: 'YouTube',
      //   route: 'youtube'
      // },

      // {
      //   title: 'Frames',
      //   route: 'frames'
      // },

      // {
      //   title: 'Radio',
      //   route: 'radio'
      // },

      {
        title: 'Backups',
        route: 'backups'
      }
    ])
  
    return {
      navbar
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.aside {
  width: $asideWidth;
  flex: none;
  background-color: $white;
  border-right: 1px solid $border;

  &__homelink {
    display: flex;
    align-items: center;
    font-size: 16px;
    padding: 0 25px;
    height: $headerHeight;
    font-weight: 700;
    text-transform: uppercase;
    color: $pale;

    .icon-vinyl {
      width: 25px;
      height: 25px;
      margin-right: 10px;
      flex: none;
      fill: $pale;
      stroke: $pale;
    }
  }

  &__nav {
    padding: 25px;

    &-link {
      font-size: 14px;
      color: $pale;
      line-height: 3;
      font-weight: 600;
      display: block;
      transition: color 0.2s ease;

      &:hover,
      &.router-link-active {
        color: $dark;
        transition: color 0.2s ease;
      }
    }
  }
}

</style>
