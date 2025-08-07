<template>
  <select
    :class="stateClasses"
    :name="entityKey"
    autocomplete="off"
    v-model="localSelected"
  >
    <option
      v-for="option in normalizedOptions"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { SelectInputFieldSchema } from '~shared/lib'

interface Props {
  options: Array<string | number> | SelectInputFieldSchema['options']
  entityKey: string
  modelValue?: string | number | null
  className?: string
  isMarkedSelected?: boolean
  isInverted?: boolean
  isText?: boolean
  size?: 'small' | 'medium' | 'large'
}

interface Emits {
  (e: 'passSelectedValue', payload: [string, string | number | null]): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  isMarkedSelected: true
})

const emit = defineEmits<Emits>()

const stateClasses = computed(() => [
  'select',
  {
    '--active': props.isMarkedSelected && (!!props.modelValue && props.modelValue !== normalizedOptions.value[0].value),
    '--inverted': props.isInverted,
    '--text': props.isText
  },
  `--${props.size}`,
  props.className,
])

const normalizedOptions = computed(() => {
  return props.options.map((option) => {
    if (typeof option === 'object') {
      return {
        label: option.label,
        value: option.value
      }
    } else {
      return {
        label: option,
        value: option
      }
    }
  })
})

const localSelected = ref<string | number | null>(props.modelValue || normalizedOptions.value[0].value)

watch(
  localSelected,
  (value, prevValue) => {
    if (value !== prevValue) {
      emit('passSelectedValue', [props.entityKey, value])
    }
  },
  { immediate: false }
)

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      localSelected.value = normalizedOptions.value[0].value
    }
  }
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

  option {

    &:first-of-type {
      display: none;
    }
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
