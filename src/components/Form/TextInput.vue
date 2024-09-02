<template>
  <input
    :id="id"
    :class="stateClasses"
    :placeholder="localize(placeholder || '')"
    :style="style"
    :type="type"
    :name="name"
    :readonly="readonly"
    :required="required"
    autocomplete="off"
    @input="(e) => emit('onInput', (e.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StyleValue } from 'vue'
import useGlobalStore from '~/store/global'

interface Props {
  name: string
  type: TextInputFieldSchema['type']
  size?: ElementSize
  defaultValue?: string
  id?: string
  isError?: boolean
  placeholder?: string
  readonly?: boolean
  required?: boolean
  disabled?: boolean
  style?: StyleValue
}

interface Emits {
  (e: 'onInput', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  isError: false,
  required: false,
  readonly: false,
  disabled: false,
  size: 'medium'
})

const emit = defineEmits<Emits>()

const {
  globalGetters: { localize }
} = useGlobalStore()

const stateClasses = computed(() => [
  'input-field',
  `--${props.size}`,
  {
    '--error': props.isError
  }
])
</script>

<style scoped lang="scss">
@import '~/scss/variables.scss';
@import 'include-media';

.input-field {
  border-radius: $borderRadiusSM;
  border: 1px solid $paleMD;
  width: 100%;

  &.--medium {
    padding: .5rem 1rem;
    font-size: .875rem;
    height: $inputSizeMD;
  }

  &.--error {
    border-color: $error;
  }

  &::placeholder {
    color: $paleDP;
  }
}
</style>
