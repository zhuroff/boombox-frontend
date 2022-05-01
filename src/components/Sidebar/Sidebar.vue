<template>
  <aside :class="[{ '--opened' : isExpanded }, 'aside']">
    <ButtonBurger
      :isActive="isExpanded"
      @burgerClick="burgerClick"
    />

    <router-link
      class="aside__homelink"
      to="/"
      @click="burgerClick"
    >
      <Sprite name="vinyl" />
      <span>BoomBox</span>
    </router-link>

    <Search />

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
            @click="burgerClick"
          >{{ item.title }}</router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script lang="ts">

import { defineComponent, reactive, ref } from 'vue'
import ButtonBurger from '~/components/Button/ButtonBurger.vue'
import Sprite from '~/components/Sprite/Sprite.vue'
import Search from '~/components/Search/Search.vue'
import './Sidebar.scss'

export default defineComponent({
  components: {
    ButtonBurger,
    Sprite,
    Search
  },

  props: {
    isExpanded: {
      type: Boolean,
      required: true
    }
  },

  setup(_, { emit }) {
    const navbar = reactive([
      {
        title: 'Albums',
        route: 'albums'
      },

      {
        title: 'Frames',
        route: 'frames'
      },

      {
        title: 'Artists',
        route: 'artists'
      },

      {
        title: 'Genres',
        route: 'genres'
      },

      {
        title: 'Periods',
        route: 'periods'
      },

      {
        title: 'Collections',
        route: 'collections'
      },

      {
        title: 'Playlists',
        route: 'playlists'
      },

      {
        title: 'YouTube',
        route: 'youtube'
      },

      {
        title: 'Radio',
        route: 'radio'
      },

      {
        title: 'Backups',
        route: 'backups'
      }
    ])

    const burgerClick = () => {
      emit('burgerClick')
    }
  
    return {
      navbar,
      burgerClick
    }
  }
})

</script>
