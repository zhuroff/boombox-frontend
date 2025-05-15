<template>
  <div class="category__title">
    <input
      v-if="isEditable"
      type="text"
      class="category__title-input"
      v-model="localHeroTitle"
    >
    <div
      v-else
      class="category__title-block"
    >{{ localHeroTitle }}</div>
    <div class="category__title-footer">
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
@use '~/scss/variables' as var;

.category__title {

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

    @include var.media('<tablet') {
      @include var.serif(2rem);
    }

    @include var.media('>=tablet') {
      @include var.serif(3rem);
    }
  }

  &-footer {
    font-weight: 600;
    color: var.$white;
  }
}
</style>
