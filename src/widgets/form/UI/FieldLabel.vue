<template>
  <label
    :for="targetId"
    :class="[{'--error': !!errors?.length}, 'label']"
  >
    <span
      v-if="!!labelText && ['top', 'left'].includes(labelTextPosition)"
      :class="stateClasses"
    >
      {{ localize(labelText) }}
    </span>
    <slot name="formInput"></slot>
    <span
      v-if="!!labelText && ['right', 'bottom', undefined].includes(labelTextPosition)"
      :class="stateClasses"
    >
      {{ localize(labelText) }}
    </span>
    <small
      v-for="error in errors"
      :key="error"
      class="label__error"
    >
      {{ localize(error) }}
    </small>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useGlobalStore from '~/store/global'

interface Props {
  errors?: string[]
  labelText?: string
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
  'label__text',
  `--${props.size}`,
  `--${props.labelTextPosition}`,
  {
    '--error': props.isError
  }
]))
</script>

<style setup lang="scss">
@use '~/scss/variables' as var;

.label {
  display: block;
  height: auto;
  position: relative;

  &__text {
    display: block;
    height: auto !important;

    &.--top {
      margin-bottom: 0.35rem;
    }

    &.--bottom {
      margin-top: 0.35rem;
    }
  }

  &.--error {
    .label__text {
      color: var.$error;
    }
  }

  &__error {
    display: block;
    color: var.$error;
    margin-top: 0.25rem;
  }
}
</style>
