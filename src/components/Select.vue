<template>
  <select class="select">
    <option>{{ lang(`${localeKey}.${entityKey}`) }}</option>
    <option
      v-for="[option, isSelected] in options"
      :key="option"
      :value="option"
    >{{ lang(`${localeKey}.${entityKey}`) }}: {{ option }}</option>
  </select>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { useLocales } from '~/hooks/useLocales'

export default defineComponent({
  name: 'Select',
  props: {
    options: {
      type: Map as PropType<Map<string, boolean>>,
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
  setup() {
    const { lang } = useLocales()
    return { lang }
  }
})
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import 'include-media';

.select {
  padding: 0.5rem;
  border-color: $border;
  border-radius: $borderRadiusMD;

  option:first-of-type {
    display: none;
  }
}
</style>
