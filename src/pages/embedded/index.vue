<template>
  <Component :is="routeComponent" />
</template>

<script lang="ts">

import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import EmbeddedList from './list/index.vue'
import EmbeddedPage from './_id/index.vue'

export default defineComponent({
  components: {
    EmbeddedList,
    EmbeddedPage
  },

  setup() {
    const route = useRoute()

    const routeComponent = computed(() => {
      if (route.name === 'frames') {
        return EmbeddedList
      }

      return EmbeddedPage
    })

    return { routeComponent }
  }
})

</script>
