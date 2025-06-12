<template>
  <select
    :class="stateClasses"
    v-model="localSelected[entityKey]"
  >
    <option v-if="localeKey">
      {{ localize(`${localeKey}.${entityKey}`) }}
    </option>
    <option
      v-for="option in options"
      :key="typeof option === 'object' ? option.value : option"
      :value="option"
    >
      {{
        typeof option === 'object'
          ? localize(option.label)
          : option === 'unknown'
            ? localize('unknown')
            : option
      }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocalization } from '~shared/model'
import type { TableFilters, SelectInputFieldSchema } from '~shared/lib'

interface Props {
  options: Array<string | number> | SelectInputFieldSchema['options']
  selected: Record<keyof TableFilters, null | string | number>
  entityKey: string
  localeKey?: string
  className?: string
  isMarkedSelected?: boolean
  isInverted?: boolean
  isText?: boolean
  size?: 'small' | 'medium' | 'large'
}

interface Emits {
  (e: 'update:select', payload: [string, string | number | null]): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  isMarkedSelected: true
})

const emit = defineEmits<Emits>()

const { localize } = useLocalization()

const stateClasses = computed(() => [
  'select',
  {
    '--active': props.isMarkedSelected && !!props.selected[props.entityKey],
    '--inverted': props.isInverted,
    '--text': props.isText
  },
  `--${props.size}`,
  props.className,
])

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
@use '~/app/styles/variables' as var;

.select {
  position: relative;
  cursor: pointer;
  padding: 0 0.25rem;
  border-color: var.$paleLT;
  border-radius: var.$borderRadiusMD;
  background-color: transparent;
  border: 1px solid var.$black;
  max-width: inherit;
  height: inherit;
  font-weight: 700;
  outline: none;

  option:first-of-type {
    display: none;
  }

  &.--active {
    border: 2px solid var.$info;
  }

  &.--small {
    height: var.$elementHeightSM;
  }

  &.--medium {
    height: var.$elementHeightMD;
  }

  &.--large {
    height: var.$elementHeightLG;
  }

  &.--text {
    border: 0;
    background-color: transparent;
  }
}
</style>
