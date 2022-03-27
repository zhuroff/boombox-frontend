<template>
  <Component :is="routeComponent" />
</template>

<script lang="ts">

import { defineComponent, computed } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import PeriodsList from './list/index.vue'
import PeriodPage from './_id/index.vue'

export default defineComponent({
  components: {
    PeriodsList,
    PeriodPage
  },

  setup() {
    const route = useRoute()

    const routeComponent = computed(() => {
      if (route.name === 'Periods') {
        return PeriodsList
      }

      return PeriodPage
    })

    return { routeComponent }
  }
})

</script>
