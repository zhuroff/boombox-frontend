<template>
  <component :is="IconComponent" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import SpriteEllipsis from './SpriteEllipsis.vue'
import SpritePlay from './SpritePlay.vue'
import SpriteDisable from './SpriteDisable.vue'
import SpriteSpinner from './SpriteSpinner.vue'
import SpritePause from './SpritePause.vue'
import SpritePlus from './SpritePlus.vue'
import SpriteMinus from './SpriteMinus.vue'
import SpritePlaying from './SpritePlaying.vue'
import SpriteDrag from './SpriteDrag.vue'
import SpriteChevronRight from './SpriteChevronRight.vue'
import SpriteChevronLeft from './SpriteChevronLeft.vue'
import SpriteChevronRightDouble from './SpriteChevronRightDouble.vue'
import SpriteChevronLeftDouble from './SpriteChevronLeftDouble.vue'
import SpriteChevronDown from './SpriteChevronDown.vue'
import SpriteDiscogs from './SpriteDiscogs.vue'
import SpriteClose from './SpriteClose.vue'
import SpriteLoupe from './SpriteLoupe.vue'
import SpritePlaylist from './SpritePlaylist.vue'
import SpritePlaylistRemove from './SpritePlaylistRemove.vue'
import SpriteCamera from './SpriteCamera.vue'
import SpriteSave from './SpriteSave.vue'
import SpriteDelete from './SpriteDelete.vue'
import SpriteVinyl from './SpriteVinyl.vue'
import SpriteRepeat from './SpriteRepeat.vue'
import SpriteRepeatActive from './SpriteRepeatActive.vue'
import SpriteNext from './SpriteNext.vue'
import SpritePrevious from './SpritePrevious.vue'
import SpriteVolume from './SpriteVolume.vue'
import SpriteVolumeOff from './SpriteVolumeOff.vue'
import SpriteYouTube from './SpriteYouTube.vue'
import SpriteFlagBy from './SpriteFlagBy.vue'
import SpriteFlagEn from './SpriteFlagEn.vue'

export default defineComponent({
  name: 'Sprite',
  components: {
    SpritePlay,
    SpriteEllipsis,
    SpriteDisable,
    SpriteSpinner,
    SpritePause,
    SpritePlus,
    SpriteMinus,
    SpritePlaying,
    SpriteDrag,
    SpriteChevronRight,
    SpriteChevronLeft,
    SpriteChevronRightDouble,
    SpriteChevronLeftDouble,
    SpriteChevronDown,
    SpriteDiscogs,
    SpriteClose,
    SpriteLoupe,
    SpritePlaylist,
    SpritePlaylistRemove,
    SpriteCamera,
    SpriteSave,
    SpriteDelete,
    SpriteVinyl,
    SpriteRepeat,
    SpriteRepeatActive,
    SpriteNext,
    SpritePrevious,
    SpriteVolume,
    SpriteVolumeOff,
    SpriteYouTube,
    SpriteFlagBy,
    SpriteFlagEn
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const IconsMap = new Map([
      ['ellipsis', SpriteEllipsis],
      ['play', SpritePlay],
      ['disable', SpriteDisable],
      ['spinner', SpriteSpinner],
      ['pause', SpritePause],
      ['plus', SpritePlus],
      ['minus', SpriteMinus],
      ['playing', SpritePlaying],
      ['drag', SpriteDrag],
      ['chevron-right', SpriteChevronRight],
      ['chevron-left', SpriteChevronLeft],
      ['chevron-right-double', SpriteChevronRightDouble],
      ['chevron-left-double', SpriteChevronLeftDouble],
      ['chevron-down', SpriteChevronDown],
      ['discogs', SpriteDiscogs],
      ['close', SpriteClose],
      ['loupe', SpriteLoupe],
      ['playlist', SpritePlaylist],
      ['playlist-remove', SpritePlaylistRemove],
      ['camera', SpriteCamera],
      ['save', SpriteSave],
      ['delete', SpriteDelete],
      ['vinyl', SpriteVinyl],
      ['repeat', SpriteRepeat],
      ['repeat-active', SpriteRepeatActive],
      ['next', SpriteNext],
      ['previous', SpritePrevious],
      ['volume', SpriteVolume],
      ['volume-off', SpriteVolumeOff],
      ['youtube', SpriteYouTube],
      ['flag-by', SpriteFlagBy],
      ['flag-en', SpriteFlagEn]
    ])

    const IconComponent = computed(() => (
      IconsMap.get(props.name) || null
    ))

    return { IconComponent }
  }
})
</script>
