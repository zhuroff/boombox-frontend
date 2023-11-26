<template>
  <div class="player__playlist">
    <Button
      icon="playlist"
      isOutlined
      :className="isActive ? '--active' : ''"
      @click="togglePlaylistState"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Button from '../Button.vue'

export default defineComponent({
  name: 'PlayerList',
  components: {
    Button
  },
  props: {
    isActive: {
      type: Boolean,
      required: true
    }
  },
  setup(_, { emit }) {
    const togglePlaylistState = () => {
      emit('togglePlaylistState')
    }

    return { togglePlaylistState }
  }
})
</script>

<style lang="scss">
@import '../../scss/variables.scss';
@import 'include-media';

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
        fill: $white;
      }

      &.--active {

        .icon {
          fill: $accent;
        }
      }
    }
  }
}
</style>
