<template>
  <Component :is="routeComponent" />
</template>

<script lang="ts">

import { defineComponent, computed } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import AlbumsList from './list/index.vue'
import AlbumPage from './_id/index.vue'

export default defineComponent({
  components: {
    AlbumsList,
    AlbumPage
  },

  setup() {
    const route = useRoute()

    const routeComponent = computed(() => {
      if (route.name === 'Albums') {
        return AlbumsList
      }

      return AlbumPage
    })

    return { routeComponent }
  }
})

</script>
