<template>
  <div class="tracklist__row-cell --pointer --fix">
    <Button
      icon="disable"
      size="small"
      isText
      className="tracklist__row-action"
      @click="disableTrack"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import store from '~/store'
import Button from '~/components/Button.vue'

export default defineComponent({
  components: {
    Button
  },
  props: {
    fileid: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { actions } = store

    const disableTrack = () => {
      actions.disableOrEnableTrack(props.fileid)
    }

    return { disableTrack }
  }
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables';
.tracklist__row {

  &.--playing {
    .tracklist__row-cell {
      opacity: 0.25;
      pointer-events: none;
    }
  }

  &-action {

    &:hover {
      fill: inherit;
      stroke: inherit;
      color: $white;
    }
  }
}
</style>
