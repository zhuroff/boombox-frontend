<template>
  <label
    :for="targetId"
    :class="stateClasses"
  >
    <span
      v-if="['top', 'left'].includes(labelTextPosition)"
      class="label__text"
    >
      {{ localize(labelText) }}
    </span>
    <slot></slot>
    <span
      v-if="['right', 'bottom', undefined].includes(labelTextPosition)"
      class="label__text"
    >
      {{ localize(labelText) }}
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useGlobalStore from '~/store/global'

interface Props {
  labelText: string
  size?: ElementSize
  labelTextPosition?: ElementPosition
  required?: boolean
  isError?: boolean
  targetId?: string
}

const props = withDefaults(defineProps<Props>(), {
  labelTextPosition: 'top',
  size: 'medium'
})

const {
  globalGetters: { localize }
} = useGlobalStore()

const stateClasses = computed(() => ([
  'label',
  `--${props.size}`,
  `--${props.labelTextPosition}`,
  {
    '--error': props.isError
  }
]))
</script>

<style setup lang="scss">
.label {
  display: block;

  &.--medium {
    font-size: 1rem;
  }

  &.--top,
  &.--bottom {

    .label__text {
      display: block;
    }
  }

  &.--top {

    .label__text {
      margin-bottom: 0.35rem;
    }
  }

  &.--bottom {

    .label__text {
      margin-top: 0.35rem;
    }
  }
}
</style>
