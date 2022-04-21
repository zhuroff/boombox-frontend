<template>  
  <div :class="[{ '--current' : current.fileid === station.stationuuid }, 'station']">
    <div class="station__cover">
      <button
        class="station__play"
        @click="playStation"
      >
        <AppSprite
          v-if="current.fileid !== station.stationuuid || current.isOnPause"
          name="play"
        />

        <AppSprite
          v-else-if="current.fileid === station.stationuuid && !current.isOnPause"
          name="pause"
        />
      </button>
    </div>

    <div class="station__content">
      <div class="station__name">{{ station.name }}</div>
      <div class="station__tags">
        <button
          v-for="(tag, index) in stationTags"
          :key="index"
          :class="[{ '--selected' : tag === genre }, 'station__tags_button']"
          @click="$emit('fetchByGenre', tag)"
        >{{ tag }}</button>
      </div>
    </div>

    <button
      v-if="isSaved"
      class="station__save"
      @click="removeStationFromDatabase"
    >
      <AppSprite name="remove" />
    </button>

    <button
      v-else
      class="station__save"
      @click="saveStationToDatabase"
    >
      <AppSprite name="save" />
    </button>
  </div>
</template>

<script>

import { computed, reactive } from 'vue'
import AppSprite from '@/components/AppSprite.vue'

export default {
  name: 'CardRadio',

  components: {
    AppSprite
  },

  props: {
    station: {
      type: Object,
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
    const stationTags = reactive(computed(() => (
      props.station?.tags?.split(',')
    )))

    const playStation = () => emit('playStation', props.station)

    const saveStationToDatabase = () => {
      emit('saveStationToDatabase', props.station)
    }

    const removeStationFromDatabase = () => {
      emit('removeStationFromDatabase', props.station)
    }

    return {
      stationTags,
      playStation,
      saveStationToDatabase,
      removeStationFromDatabase
    }
  }
}

</script>

<style lang="scss" scoped>

@import '@/scss/variables';

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

    .icon-play,
    .icon-pause {
      width: 10px;
      height: 10px;
      margin-left: 2px;
      fill: $white;
    }

    .icon-pause {
      margin-left: 0;
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
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;

    &_button {
      padding: 2px 7px;
      border: 0;
      background-color: transparent;
      outline: none;
      color: $pale;
      font-size: 12px;
      border-radius: 3px;
      transition: all 0.2s ease;

      &:hover {
        background-color: $white;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        transition: all 0.2s ease;
      }

      &.--selected {
        background-color: $white;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      }
    }
  }

  &__save {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    border: 0;
    background-color: transparent;
    outline: none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon-save {
      width: 20px;
      height: 20px;
    }

    .icon-remove {
      width: 17px;
      height: 17px;
    }
  }
}

</style>
