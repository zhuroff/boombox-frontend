<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!playlist.isFetched"
        mode="light"
      />
    </transition>
      
    <div id="scrollspace">
      <transition-group name="flyUp">
        
      </transition-group>
    </div>
  </section>
</template>

<script lang="ts">

import { defineComponent, reactive } from 'vue'
import AppPreloader from '~/components/Preloader/Preloader.vue'

export default defineComponent({
  components: {
    AppPreloader
  },

  setup() {
    const playlist = reactive({
      isFetched: false,
      data: {}
    })

    return {
      playlist
    }
  }
})

</script>
