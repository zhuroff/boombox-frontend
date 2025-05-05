<template>
  <div class="player__playlist">
    <Button
      icon="playlist"
      :className="isActive ? '--active' : ''"
      @click="() => emit('togglePlaylistState')"
    />
  </div>
</template>

<script setup lang="ts">
import Button from '../Button.vue'

interface Props {
  isActive: boolean
}

interface Emits {
  (e: 'togglePlaylistState'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<style lang="scss">
@use '~/scss/variables' as var;

.player {

  &__playlist {
    display: flex;
    align-items: center;

    .button {
      margin-left: 23px;
      width: 25px;
      height: 25px;
      cursor: pointer;
      border: 0;
      background-color: transparent;
      padding: 0;

      .icon {
        width: 24px;
        fill: var.$white;
      }

      &.--active {

        .icon {
          fill: var.$accent;
        }
      }
    }
  }
}
</style>
