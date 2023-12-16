<template>
  <div :class="[
    { '--fix' : isOutAlbumAdded },
    'tracklist__row-cell --pointer --add'
  ]">
    <Button
      v-if="!isOutAlbumAdded"
      icon="chevron-right"
      size="small"
      isOutlined
      isText
      :title="lang('player.playNext')"
      @click="() => playTrackNext(track)"
    />
    <Button
      v-if="!isOutAlbumAdded"
      icon="chevron-right-double"
      size="small"
      isOutlined
      isText
      :title="lang('player.addToList')"
      @click="() => addToEndOfList(track)"
    />
    <Button
      v-if="isOutAlbumAdded"
      icon="playlist-remove"
      size="small"
      isOutlined
      isText
      className="--excluded"
      :title="lang('player.removeFromList')"
      @click="excludeTrack"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { useLocales } from '~/hooks/useLocales'
import store from '~/store'
import AlbumTrack from 'classes/AlbumTrack'
import Button from '~/components/Button.vue'

export default defineComponent({
  name: 'TrackItemAdd',
  components: {
    Button
  },
  props: {
    track: {
      type: Object as PropType<AlbumTrack>,
      required: true
    },
  },
  setup(props) {
    const { lang } = useLocales()
    const { actions, getters } = store
    
    const isOutAlbumAdded = computed(() => (
      getters.currentPlaylistTracks.value.some(({ _id }) => _id === props.track._id)
    ))

    const excludeTrack = () => {
      actions.removeTrackFromPlaylist(props.track._id)
    }

    return {
      lang,
      excludeTrack,
      isOutAlbumAdded,
      playTrackNext: actions.playTrackNext,
      addToEndOfList: actions.addToEndOfList,
      removeTrackFromPlaylist: actions.removeTrackFromPlaylist
    }
  }
})
</script>

<style lang="scss">
@import '~/scss/variables';

.tracklist__row {

  &-cell {
    
    &.--add {
      .button {
        fill: $paleDP;
        padding: 0;
        height: 100%;

        &:not(.--excluded) {
          width: 30px;
        }

        &.--excluded {
          width: 100%;

          .icon {
            width: 1.2rem;
          }
        }

        &:hover {
          fill: $white;
          color: $white;
        }

        &.--active {
          border: 1px solid $paleMD;
          background-color: $paleMD;
          border-radius: 50%;
          fill: $white;
          color: $white;

          &:hover {
            fill: $white;
            color: $white;
            stroke: inherit;
          }
        }
      }
    }
  }
}
</style>
