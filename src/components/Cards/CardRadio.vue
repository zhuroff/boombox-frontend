<template>  
  <div :class="[{ '--current' : current.fileid === station.stationuuid }, 'station']">
    <div class="station__cover">
      <button
        class="station__play"
        @click="playStation"
      >
        <Sprite
          v-if="isOnPlay"
          name="playing"
        />

        <Sprite
          v-else-if="current.fileid !== station.stationuuid || current.isOnPause"
          name="play"
        />

        <Sprite
          v-else
          name="pause"
        />
      </button>
    </div>

    <div class="station__content">
      <div class="station__name">{{ station.name }}</div>
      <div class="station__country">{{ station.country }}</div>
      <ul class="station__tags">
        <CardRadioGenre
          v-for="(tag, index) in stationTags"
          :key="index"
          :genre="tag"
          :isActive="tag === genre"
          @click="$emit('fetchByGenre', tag)"
        />
      </ul>
    </div>

    <button
      v-if="isSaved"
      class="station__save"
      @click="removeStationFromDatabase"
    >
      <Sprite name="remove" />
    </button>

    <button
      v-else
      class="station__save"
      @click="saveStationToDatabase"
    >
      <Sprite name="plus" />
    </button>
  </div>
</template>

<script lang="ts">

import { defineComponent, computed, reactive, PropType } from 'vue'
import { RadioStationResponse } from '~/types/Radio'
import { useStore } from 'vuex'
import { key } from '~/store'
import Sprite from '~/components/Sprite/Sprite.vue'
import CardRadioGenre from '@/components/Cards/CardRadioGenre.vue'

export default defineComponent({
  name: 'CardRadio',

  components: {
    Sprite,
    CardRadioGenre
  },

  props: {
    station: {
      type: Object as PropType<RadioStationResponse>,
      required: true
    },

    genre: {
      type: String,
      required: true
    },

    current: {
      type: Object,
      required: false
    },

    isSaved: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  setup(props, { emit }) {
    const store = useStore(key)

    const stationTags = reactive(computed(() => (
      props.station?.tags?.split(',')
    )))

    const isOnPlay = computed(() => (
      store.getters.playingTrack.fileid === props.station.stationuuid
      && !store.getters.playingTrack.isOnPause
      && !store.getters.playingTrack.isOnLoading
    ))

    const playStation = () => emit('playStation', props.station)

    const saveStationToDatabase = () => {
      emit('saveStationToDatabase', props.station)
    }

    const removeStationFromDatabase = () => {
      emit('removeStationFromDatabase', props.station)
    }

    return {
      isOnPlay,
      stationTags,
      playStation,
      saveStationToDatabase,
      removeStationFromDatabase
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';
@import 'include-media';

.station {
  position: relative;
  display: flex;
  grid-column: 1;

  &:hover {

    .station__img {
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .station__play {
      opacity: 1;
      transition: opacity 0.2s ease;
    }

    .station__save {
      opacity: 1;
      transition: opacity 0.3s $animation;
    }
  }

  &.--current {
    
    &:after {
      content: '';
      position: absolute;
      top: -10px;
      left: -10px;
      width: calc(100% + 20px);
      height: calc(100% + 20px);
      border-radius: 5px;
    }
  }

  &__play {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    border: 0;
    padding: 0;
    background-color: $dark;
    transform: translate(-50%, -50%);
    transition: opacity 0.2s ease;

    .icon.play,
    .icon.pause {
      width: 20px;
      height: 20px;
      color: $white;
    }

    .icon.playing {
      width: 20px;
      height: 20px;
      margin-left: 2px;
      fill: $white;
    }
  }

  &__cover {
    height: 40px;
    width: 40px;
    flex: none;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;
    margin-right: 3px;
  }

  &__content {
    position: relative;
    z-index: 1;
  }

  &__name {
    font-weight: 600;
    color: $dark;
    font-size: 14px;
    z-index: 1;
    margin: 0 0 3px 7px;

    @include media('<desktop') {
      padding-right: 20px;
    }
  }

  &__country {
    font-weight: 600;
    color: $dark;
    font-size: 12px;
    margin: 0 0 3px 7px;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
  }

  &__save {
    position: absolute;
    z-index: 1;
    top: -9px;
    right: -9px;
    width: 30px;
    height: 30px;
    border: 0;
    background-color: transparent;
    outline: none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s $animation;

    @include media('>=desktop') {
      opacity: 0;
    }

    .icon {
      width: 17px;
      height: 17px;
    }
  }
}

</style>
