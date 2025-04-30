<template>
  <div :class="[{ '--active' : selected[entityKey] }, 'select']">
    <select
      class="select__input"
      v-model="localSelected[entityKey]"
    >
      <option>
        {{ localize(`${localeKey}.${entityKey}`) }}
      </option>
      <option
        v-for="option in options"
        :key="option"
        :value="option"
      >
        {{ option === 'unknown' ? localize('unknown') : option }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import useGlobalStore from '~/store/global'

interface Props {
  options: string[]
  selected: Record<keyof TableFilters, null | string>
  localeKey: string
  entityKey: string
}

interface Emits {
  (e: 'update:select', payload: [string, string | null]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  globalGetters: { localize }
} = useGlobalStore()

const localSelected = ref({
  ...props.selected,
  [props.entityKey]: props.selected[props.entityKey] || localize(`${props.localeKey}.${props.entityKey}`)
})

watch(
  localSelected,
  (value) => {
    emit('update:select', [props.entityKey, value[props.entityKey]])
  },
  { immediate: false, deep: true }
)
</script>

<style lang="scss" scoped>
@use '~/scss/variables' as var;

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
      background-color: var.$info;

    }
  }
  
  &__input {
    padding: 0.5rem;
    border-color: var.$paleLT;
    border-radius: var.$borderRadiusMD;
    max-width: inherit;

    option:first-of-type {
      display: none;
    }
  }
}
</style>
