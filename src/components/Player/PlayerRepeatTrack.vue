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
import store from '~/store'
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
    const { actions, getters } = store

    const isTrackRepeat = computed(() => (
      getters.playingTrack.value?.isOnRepeat
    ))

    const changeRepeatState = () => {
      actions.changeRepeatState()
    }

    return {
      isTrackRepeat,
      changeRepeatState
    }
  }
})
</script>

