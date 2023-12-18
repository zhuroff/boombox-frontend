<template>  
  <div class="tracklist__row-cell --pointer --fix">
    <button
      class="tracklist__row-action"
      @click="removeTrackFromPlaylist"
    >
      <Sprite name="delete" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Sprite from '~/components/Sprite/Sprite.vue'

export default defineComponent({
  components: {
    Sprite
  },

  setup(_, { emit }) {
    const removeTrackFromPlaylist = () => {
      // const playlist = computed(() => store.getters.playlist)

      // if (playlist) {
      //   emit('removeTrackFromPlaylist', { listID: playlist.value._id })
      // }
    }

    return { removeTrackFromPlaylist }
  }
})
</script>

<style lang="scss" scoped>
@import '@/scss/variables';

.tracklist__row {

  &-cell {

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
    fill: $paleDP;
    stroke: $paleDP;
    transition: all 0.2s ease;
  }
}
</style>
