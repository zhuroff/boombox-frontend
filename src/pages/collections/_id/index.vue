<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!collection.isFetched"
        mode="light"
      />
    </transition>
      
    <div id="scrollspace">
      <transition name="flyUp"></transition>
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
    const collection = reactive({
      isFetched: false,
      data: {} as any
    })

    return {
      collection
    }
  }
})

</script>
