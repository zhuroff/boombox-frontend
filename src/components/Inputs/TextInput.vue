<template>
  <div class="text-input">
    <div class="text-input__wrapper">
      <input
        :class="['text-input__element', `--${size}`, errorMessage ? '--error' : '']"
        :placeholder="placeholder && `${placeholder}${isRequired ? '*' : ''}`"
        :style="style"
        :type="type"
        :readonly="isReadonly"
        autocomplete="off"
        v-model="localValue"
      />
      <div
        v-if="errorMessage"
        class="text-input__error"
      >{{ errorMessage }}</div>
    </div>
    <TextInputRefList
      v-if="refEntityKey && isRefListActive"
      :refConfig="refConfig"
      @selectRefItem="selectRefItem"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { StyleValue } from 'vue'
import type { BasicEntity, RefPayload } from '~/types/Common'
import TextInputRefList from './TextInputRefList.vue'

interface Props {
  placeholder?: string
  size?: 'small' | 'medium' | 'large'
  type?: 'text' | 'password'
  style?: StyleValue
  inputValue?: string
  isRequired?: boolean
  isReadonly?: boolean
  refEntityKey?: string
  errorMessage?: string
}

interface Emits {
  (e: 'setInputValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localValue = ref(props.inputValue || '')
const isRefListActive = ref(false)

const refConfig = computed(() => ({
  refEntityKey: props.refEntityKey || '',
  refEntityValue: localValue.value
}))

const selectRefItem = (payload: RefPayload<BasicEntity>) => {
  isRefListActive.value = false
  nextTick(() => {
    localValue.value = payload.refEntityValue.title
    emit('setInputValue', payload.refEntityValue._id)
  })
}

watch(localValue, (newValue) => {
  if (!props.refEntityKey) {
    emit('setInputValue', newValue)
  }

  if (newValue.length >= 3 && props.refEntityKey) {
    isRefListActive.value = true
  }
})
</script>
