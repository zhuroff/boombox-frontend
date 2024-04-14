<template>
  <li class="cards__radio">
    <div
      class="cards__radio-title"
      :title="toCapitalize(card.title)"
    >{{ reduceString(toCapitalize(card.title), 40) }}</div>
    <div class="cards__radio-country">{{ card.country }}</div>
    <Button
      size="medium"
      isRounded
      isOutlined
      :icon="isOnPlay ? 'pause' : 'play'"
      :style="{ backgroundColor: '#fcd568', borderColor: '#fcd568' }"
      @click="playStation"
    />
    <!-- <div class="cards__radio-tags">
      <Button
        v-for="tag in tags"
        :key="tag"
        :label="toCapitalize(tag)"
        size="small"
        @click="playStation"
      />
    </div> -->
  </li>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, PropType } from 'vue'
import { toCapitalize, reduceString } from '~/utils'
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
  },
  setup(props, { emit }) {
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
      reduceString,
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
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin: 0 15px 30px;
    padding: 25px 15px;
    background-color: $black;
    border: 1px solid $black;
    border-radius: $borderRadiusMD;
    color: $paleLT;

    &-title {
      @include serif(1.25rem, 600);
      text-align: center;
      margin-bottom: 0.25rem;
    }

    &-country {
      font-size: 0.875rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    .button {
      margin-top: auto;
    }
  }
}
</style>
