<template>
  <div
    v-if="isOnPlay"
    class="tracklist__row-cell --pointer --fix"
  >
    <!-- <button class="tracklist__row-action" @click="pauseTrack">
      <Sprite name="playing" />
    </button> -->
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
import Button from "~/components/Button.vue";
import { Track } from "~/types/Track";

export default defineComponent({
  components: {
    Button,
  },

  props: {
    track: {
      type: Object as PropType<Track>,
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
      // @ts-ignore
      store.dispatch('playTrack', props.track.path /* props.track._id */);
      store.commit('expandPlayer');
    };

    const playingStateSplitter = () => {
      if (!store.getters.playingTrack._id) {
        playTrack();
      }
      // if (store.getters.playingTrack._id === 0) {
      //   playTrack();
      // } else if (store.getters.playingTrack._id === props.filePath) {
      //   if (!store.getters.playingTrack.isOnPause) {
      //     playTrack();
      //   } else {
      //     store.commit("continuePlay");
      //   }
      // } else {
      //   playTrack();
      // }
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
