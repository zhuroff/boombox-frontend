<template>
  <Component :is="routeComponent" />
</template>

<script lang="ts">

import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import PlaylistList from './list/index.vue'
import PlaylistPage from './_id/index.vue'

export default defineComponent({
  components: {
    PlaylistList,
    PlaylistPage
  },

  setup() {
    const route = useRoute()

    const routeComponent = computed(() => {
      if (route.name === 'Playlists') {
        return PlaylistList
      }

      return PlaylistPage
    })

    return { routeComponent }
  }
})

</script>
