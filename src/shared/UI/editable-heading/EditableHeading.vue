<template>
  <div class="editable__heading">
    <input
      v-if="isEditable"
      type="text"
      class="editable__heading-input"
      v-model="localHeroTitle"
    >
    <div
      v-else
      class="editable__heading-block"
    >{{ localHeroTitle }}</div>
    <div class="editable__heading-footer">
      {{ description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'

interface Props {
  isEditable: boolean
  heroTitle: string
  description: string
}

interface Emits {
  (e: 'saveNewTitle', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localHeroTitle = ref(props.heroTitle)
const inputTimer: Ref<ReturnType<typeof setTimeout> | number> = ref(0)

watch(localHeroTitle, (newValue) => {
  if (typeof inputTimer.value === 'number') {
    clearTimeout(inputTimer.value)

    inputTimer.value = setTimeout(() => {
      emit('saveNewTitle', newValue)
    }, 700)
  }
})
</script>

<style scoped lang="scss">
@use '~/app/styles/variables' as var;

.editable__heading {

  &-input {
    color: inherit
  }

  &-block {
    color: var.$warning;
    padding: 0;
    border: 0;
    box-shadow: none;
    outline: none;
    background-color: transparent;
    width: 100%;

    @include var.media('<desktop') {
      @include var.serif(2.5rem);
      margin-bottom: 0.5rem;
    }

    @include var.media('>=desktop') {
      @include var.serif(3rem);
    }
  }

  &-footer {
    font-weight: 600;
    color: var.$white;
  }
}
</style>
