<template>
  <div class="search__create">
    <TextInput
      name="create"
      type="text"
      size="large"
      :value="inputValue"
      :placeholder="inputPlaceholder"
      :isError="!!error"
      @onInput="(value) => emit('passInputValue', value)"
    />
    <Button
      v-if="!isSaveDisabled"
      icon="save"
      size="large"
      isText
      @click="() => emit('createEntity')"
    />
    <div
      v-if="!!error"
      class="search__error"
    >{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import TextInput from '../Form/TextInput.vue'
import { Button } from '~shared/UI'

interface Props {
  error: string | null
  isSaveDisabled: boolean
  inputValue: string
  inputPlaceholder?: string
}

interface Emits {
  (e: 'createEntity'): void
  (e: 'passInputValue', value: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<style scoped lang="scss">
@use '~/scss/variables' as var;

.search {

  &__create {
    position: relative;

    .input-field {
      padding-right: 2.5rem;
    }

    .button {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  &__error {
    font-size: 0.75rem;
    margin-top: 0.25rem;
    color: var.$error;
  }
}
</style>
