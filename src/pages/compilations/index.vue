<template>
  <Component :is="routeComponent" />
</template>

<script lang="ts">

import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import CompilationList from './list/index.vue'
import CompilationPage from './_id/index.vue'

export default defineComponent({
  components: {
    CompilationList,
    CompilationPage
  },

  setup() {
    const route = useRoute()

    const routeComponent = computed(() => {
      if (route.name === 'compilations') {
        return CompilationList
      }

      return CompilationPage
    })

    return { routeComponent }
  }
})

</script>
