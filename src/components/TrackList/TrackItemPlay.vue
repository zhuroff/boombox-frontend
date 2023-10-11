<template>
  <div
    v-if="isOnPlay"
    class="tracklist__row-cell --pointer --fix"
  >
    <Button
      icon="playing"
      size="small"
      isText
      className="tracklist__row-action"
      @click="pauseTrack"
    />
  </div>
  <div
    v-else
    :class="[{ '--disabled': isOnLoading }, 'tracklist__row-cell --pointer --fix']"
  >
    <Button
      :icon="isOnLoading ? 'spinner' : isOnPause ? 'pause' : 'play'"
      size="small"
      isText
      className="tracklist__row-action"
      @click="playingStateSplitter"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from "vue";
import { useStore } from "vuex";
import { key } from "~/store";
import { AlbumTrackDTO } from "~/dto/AlbumTrackDTO";
import Button from "~/components/Button.vue";

export default defineComponent({
  components: {
    Button,
  },

  props: {
    track: {
      type: Object as PropType<AlbumTrackDTO>,
      required: true
    },

    index: {
      type: Number,
      required: true,
    },
  },

  setup(props) {
    const store = useStore(key);

    const isOnPlay = computed(() => (
      store.getters.playingTrack._id === props.track._id
      && !store.getters.playingTrack.isOnPause
      && !store.getters.playingTrack.isOnLoading
    ));

    const isOnPause = computed(() => (
      store.getters.playingTrack._id === props.track._id
      && store.getters.playingTrack.isOnPause
    ));

    const isOnLoading = computed(() => (
      store.getters.playingTrack._id === props.track._id
      && store.getters.playingTrack.isOnLoading
    ));

    const pauseTrack = () => {
      store.commit("setTrackOnPause");
    };

    const playTrack = () => {
      store.dispatch('playTrack', props.track);
      store.commit('expandPlayer');
    };

    const playingStateSplitter = () => {
      if (!store.getters.playingTrack._id) {
        playTrack();
      } else if (store.getters.playingTrack._id === props.track._id) {
        if (!store.getters.playingTrack.isOnPause) {
          playTrack();
        } else {
          store.commit("continuePlay");
        }
      } else {
        playTrack();
      }
    };

    return {
      isOnPlay,
      isOnPause,
      isOnLoading,
      pauseTrack,
      playingStateSplitter,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '~/scss/variables';
.tracklist__row {
  &-action {

    &:hover {
      fill: inherit;
      stroke: inherit;
      color: $white;
    }
  }
}
</style>
