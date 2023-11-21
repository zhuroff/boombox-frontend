<template>
  <div :class="[{ '--active' : selected[entityKey] }, 'select']">
    <select
      class="select__input"
      v-model="localSelected[entityKey]"
    >
      <option>{{ lang(`${localeKey}.${entityKey}`) }}</option>
      <option
        v-for="option in options"
        :key="option"
        :value="option"
      >
        {{ option === 'unknown' ? lang('unknown') : option }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, ref, watch } from 'vue'
import { useLocales } from '~/hooks/useLocales'
import { TableFilter } from '~/types/Global'

export default defineComponent({
  name: 'Select',
  props: {
    options: {
      type: Array as PropType<string[]>,
      required: true
    },
    selected: {
      type: Object as PropType<Record<keyof TableFilter, null | string>>,
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
    const localSelected = ref({
      ...selected,
      [entityKey]: selected[entityKey] || lang(`${localeKey}.${entityKey}`)
    })

    watch(
      localSelected,
      (value) => {
        emit('update:select', [entityKey, value[entityKey]])
      },
      { immediate: false, deep: true }
    )

    return { lang, localSelected }
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
