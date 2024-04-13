<template>
  <li class="cards__radio">
    <div class="cards__radio-top">
      <Button
        size="medium"
        :icon="isOnPlay ? 'pause' : 'play'"
        @click="playStation"
      />
      <div class="cards__radio-data">
        <div class="cards__radio-title">{{ toCapitalize(card.title) }}</div>
        <div class="cards__radio-country">{{ card.country }}</div>
      </div>
    </div>
    <div class="cards__radio-tags">
      <Button
        v-for="tag in tags"
        :key="tag"
        :label="toCapitalize(tag)"
        size="small"
        @click="playStation"
      />
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, PropType } from 'vue'
import { toCapitalize } from '~/utils'
import store from '~/store'
import RadioCard from '~/classes/RadioCard'
import Button from '~/components/Button.vue'

export default defineComponent({
  name: 'RadioCard',
  components: {
    Button,
  },
  props: {
    card: {
      type: Object as PropType<RadioCard>,
      required: true
    },
    isDraggable: {
      type: Boolean,
      required: true
    }
    // genre: {
    //   type: String,
    //   required: true
    // },
    // current: {
    //   type: Object as any,
    //   required: false
    // },
    // isSaved: {
    //   type: Boolean,
    //   required: false,
    //   default: false
    // }
  },
  setup(props, { emit }) {
    console.log(props.card)
    const { actions, getters } = store

    const stationTags = reactive(computed(() => (
      props.card?.tags?.split(',')
    )))

    const isOnPlay = computed(() => (
      getters.playingTrack.value?._id === props.card._id
      && !getters.playingTrack.value.isOnPause
      && !getters.playingTrack.value.isOnLoading
    ))

    const tags = computed(() => (
      props.card?.tags?.split(',')
    ))

    const playStation = () => emit('action:play', props.card)

    const saveStationToDatabase = () => {
      emit('action:save', props.card)
    }

    const removeStationFromDatabase = () => {
      emit('action:remove', props.card)
    }

    return {
      tags,
      isOnPlay,
      stationTags,
      playStation,
      toCapitalize,
      saveStationToDatabase,
      removeStationFromDatabase
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables';
@import 'include-media';

.cards {

  &__radio {
    border-radius: $borderRadiusSM;
    border: 1px solid $black;

    &-top {
      display: flex;
      gap: 0.75rem;
    }

    &-title {
      @include serif(1rem, 600);
    }

    &-country {
      font-size: 0.875rem;
    }
  }
}

.card {
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
}
</style>
