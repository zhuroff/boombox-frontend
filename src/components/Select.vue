<template>
  <div :class="[{ '--active' : selected }, 'select']">
    <select
      class="select__input"
      v-model="selectedOption"
    >
      <option>{{ lang(`${localeKey}.${entityKey}`) }}</option>
      <option
        v-for="option in options"
        :key="option"
        :value="option"
      >{{ lang(`${localeKey}.${entityKey}`) }}: {{ option || lang('unknown') }}</option>
    </select>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, ref, watch } from 'vue'
import { useLocales } from '~/hooks/useLocales'

export default defineComponent({
  name: 'Select',
  props: {
    options: {
      type: Array as PropType<string[]>,
      required: true
    },
    selected: {
      type: String,
      required: true
    },
    localeKey: {
      type: String,
      required: true
    },
    entityKey: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup({ entityKey, selected, localeKey }, { emit }) {
    const { lang } = useLocales()
    const selectedOption = ref(selected || lang(`${localeKey}.${entityKey}`))

    watch(
      selectedOption,
      (value) => emit('update:select', [entityKey, value]),
      { immediate: false }
    )

    return { lang, selectedOption }
  }
})
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import 'include-media';

.select {
  position: relative;

  &.--active {
    &:after {
      content: '';
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(35%, -35%);
      background-color: $info;

    }
  }
  
  &__input {
    padding: 0.5rem;
    border-color: $border;
    border-radius: $borderRadiusMD;
    max-width: inherit;

    option:first-of-type {
      display: none;
    }
  }
}
</style>
