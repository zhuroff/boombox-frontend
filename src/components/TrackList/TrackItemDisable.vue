<template>
  
<div
  class="tracklist__row_cell --pointer --fix"
  @click="$emit('disableTrack')"
>
  <AppSprite name="disable" />
</div>

</template>

<script>

import AppSprite from '@/components/AppSprite.vue'

export default {
  components: {
    AppSprite
  }
}

</script>

<style lang="scss" scoped>

@import '@/scss/variables';

.tracklist__row {

  &_cell {
    position: relative;

    &:hover {

      .icon-disable {
        stroke: $dark;
        fill: $dark;
        transition: stroke 0.2s ease;
      }
    }
  }

  &.--playing {

    .tracklist__row_cell {
      opacity: 0.25;
      pointer-events: none;
    }

    .icon-disable {
      stroke: $dark;
      fill: $dark;
    }
  }

  &.--disabled {

    .tracklist__row_cell {

      &:last-child {

        .icon-disable {
          stroke: $accent;
          fill: $accent;
        }
      }
    }
  }

  .icon-disable {
    width: 15px;
    height: 15px;
    stroke: $pale;
    fill: $pale;
    transition: stroke 0.2s ease;
  }
}

</style>
