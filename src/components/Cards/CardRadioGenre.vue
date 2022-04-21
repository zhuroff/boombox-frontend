<template>
  <li class="radio__genre">
    <button
      :class="[{ '--active' : isActive }, 'radio__genre_button']"
      @click="fetchByGenre"
    >{{ genre }}</button>
  </li>
</template>

<script>

export default {
  name: 'CardRadioGenre',

  props: {
    genre: {
      type: String,
      required: true
    },

    isActive: {
      type: Boolean,
      required: true
    }
  },

  setup(props, { emit }) {
    const fetchByGenre = () => emit('fetchByGenre', props.genre)

    return { fetchByGenre }
  }
}

</script>

<style lang="scss" scoped>

@import '@/scss/variables';

.radio__genre {
  margin-right: 10px;
}

</style>
