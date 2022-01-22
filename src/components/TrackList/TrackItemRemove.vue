<template>
  
<div
  class="tracklist__row_cell --pointer --fix"
  @click="removeTrackFromPlaylist"
>
  <AppSprite name="delete" />
</div>

</template>

<script>

import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import AppSprite from '@/components/AppSprite.vue'

export default {
  components: {
    AppSprite
  },

  setup(props, { emit }) {
    const store = useStore()

    const removeTrackFromPlaylist = () => {
      const playlist = reactive(computed(() => store.getters.playlist))

      if (playlist) {
        emit('removeTrackFromPlaylist', { listID: playlist.value._id })
      }
    }

    return { removeTrackFromPlaylist }
  }
}

</script>

<style lang="scss" scoped>

@import '@/scss/variables';

.tracklist__row {

  &_cell {

    &:hover {

      .icon-delete {
        fill: $dark;
        stroke: $dark;
        transition: all 0.2s ease;
      }
    }
  }

  &.--playing {

    .icon-delete {
      fill: $dark;
      stroke: $dark;
    }
  }

  .icon-delete  {
    width: 10px;
    height: 10px;
    fill: $pale;
    stroke: $pale;
    transition: all 0.2s ease;
  }
}

</style>
