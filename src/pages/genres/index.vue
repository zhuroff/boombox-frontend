<template>
  <Component :is="routeComponent" />
</template>

<script lang="ts">

import { defineComponent, computed } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import GenresList from './list/index.vue'
import GenrePage from './_id/index.vue'

export default defineComponent({
  components: {
    GenresList,
    GenrePage
  },

  setup() {
    const route = useRoute()

    const routeComponent = computed(() => {
      if (route.name === 'genres') {
        return GenresList
      }

      return GenrePage
    })

    return { routeComponent }
  }
})

</script>
