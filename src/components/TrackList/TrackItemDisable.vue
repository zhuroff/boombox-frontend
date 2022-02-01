<template>
  
<div class="tracklist__row_cell --pointer --fix">
  <button
    class="tracklist__row_action"
    @click="disableTrack"
  >
    <AppSprite name="disable" />
  </button>
</div>

</template>

<script lang="ts">

import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import AppSprite from '~/components/AppSprite.vue'

export default defineComponent({
  components: {
    AppSprite
  },

  props: {
    fileid: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    const store = useStore(key)

    const disableTrack = () => {
      store.commit('disableOrEnableTrack', props.fileid)
    }

    return { disableTrack }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.tracklist__row {

  &.--playing {

    .tracklist__row_cell {
      opacity: 0.25;
      pointer-events: none;
    }
  }
}

</style>
