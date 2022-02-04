<template>

<component :is="layout">
  <router-view />
</component>

</template>

<script lang="ts">

import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import MainTemplate from '~/templates/MainTemplate.vue'

export default defineComponent({
  components: {
    MainTemplate
  },

  setup() {
    const route = useRoute()
    const layout = computed(() => route.meta.layout as string || 'MainTemplate')
    const syncMessage = localStorage.getItem('syncMessage')

    if (syncMessage) {
      localStorage.removeItem('syncMessage')
    }

    return {
      layout
    }
  }
})

</script>

<style lang="scss">

@import '~/scss/app.scss';

</style>
