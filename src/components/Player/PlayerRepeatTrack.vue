<template>
  
<button
  class="player__repeat"
  @click="changeRepeatState"
>
  <AppSprite
    v-if="!isTrackRepeat"
    name="repeat"
  />

  <AppSprite
    v-else
    name="repeat-active"
  />
</button>

</template>

<script lang="ts">

import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import AppSprite from '~/components/AppSprite.vue'

export default defineComponent({
  components: {
    AppSprite
  },

  setup() {
    const store = useStore(key)

    const isTrackRepeat = computed(() => (
      store.getters.playingTrack.isOnRepeat
    ))

    const changeRepeatState = () => {
      store.commit('changeRepeatState')
    }

    return {
      isTrackRepeat,
      changeRepeatState
    }
  }
})

</script>

