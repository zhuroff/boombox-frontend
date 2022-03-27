<template>
  <Component :is="routeComponent" />
</template>

<script lang="ts">

import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import ArtistsList from './list/index.vue'
import ArtistPage from './_id/index.vue'

export default defineComponent({
  components: {
    ArtistsList,
    ArtistPage
  },

  setup() {
    const route = useRoute()

    const routeComponent = computed(() => {
      if (route.name === 'Artists') {
        return ArtistsList
      }

      return ArtistPage
    })

    return { routeComponent }
  }
})

</script>
