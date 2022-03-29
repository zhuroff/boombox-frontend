<template>
  <Component :is="routeComponent" />
</template>

<script lang="ts">

import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import FramesList from './list/index.vue'
import FramePage from './_id/index.vue'

export default defineComponent({
  components: {
    FramesList,
    FramePage
  },

  setup() {
    const route = useRoute()

    const routeComponent = computed(() => {
      if (route.name === 'Frames') {
        return FramesList
      }

      return FramePage
    })

    return { routeComponent }
  }
})

</script>
