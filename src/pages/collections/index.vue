<template>
  <Component :is="routeComponent" />
</template>

<script lang="ts">

import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import CollectionList from './list/index.vue'
import CollectionPage from './_id/index.vue'

export default defineComponent({
  components: {
    CollectionList,
    CollectionPage
  },

  setup() {
    const route = useRoute()

    const routeComponent = computed(() => {
      if (route.name === 'collections') {
        return CollectionList
      }

      return CollectionPage
    })

    return { routeComponent }
  }
})

</script>
