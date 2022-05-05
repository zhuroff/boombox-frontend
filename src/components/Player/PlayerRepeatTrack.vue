<template>
  
<button
  :class="[{ '--mobile' : isMobile }, 'player__repeat']"
  @click="changeRepeatState"
>
  <Sprite
    v-if="!isTrackRepeat"
    name="repeat"
  />

  <Sprite
    v-else
    name="repeat-active"
  />
</button>

</template>

<script lang="ts">

import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import Sprite from '~/components/Sprite/Sprite.vue'

export default defineComponent({
  components: {
    Sprite
  },

  props: {
    isMobile: {
      type: Boolean,
      required: false
    }
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

