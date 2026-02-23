<template>
  <div class="editable__heading">
    <div
      ref="editableElement"
      class="editable__heading-block"
      :contenteditable="isEditable"
      @input="changeHeading"
    >{{ localHeroTitle }}</div>
    <div class="editable__heading-footer">
      {{ description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, type Ref } from 'vue'

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
const editableElement = ref<HTMLDivElement | null>(null)

const saveCursorPosition = (element: HTMLElement): number => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return 0

  const range = selection.getRangeAt(0)
  const preCaretRange = range.cloneRange()
  preCaretRange.selectNodeContents(element)
  preCaretRange.setEnd(range.endContainer, range.endOffset)
  return preCaretRange.toString().length
}

const restoreCursorPosition = (element: HTMLElement, position: number) => {
  const selection = window.getSelection()
  if (!selection) return

  const range = document.createRange()
  let charCount = 0
  const nodeStack: Node[] = [element]
  let node: Node | undefined
  let foundStart = false

  while (!foundStart && (node = nodeStack.pop())) {
    if (node.nodeType === Node.TEXT_NODE) {
      const nextCharCount = charCount + (node.textContent?.length || 0)
      if (position <= nextCharCount) {
        range.setStart(node, position - charCount)
        range.setEnd(node, position - charCount)
        foundStart = true
      } else {
        charCount = nextCharCount
      }
    } else {
      let i = node.childNodes.length
      while (i--) {
        nodeStack.push(node.childNodes[i])
      }
    }
  }

  if (foundStart) {
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

const changeHeading = async (event: InputEvent) => {
  const target = event.target as HTMLDivElement
  if (!target) return

  const value = target.innerText

  if (value?.length < 4) return

  const cursorPosition = saveCursorPosition(target)

  localHeroTitle.value = value

  await nextTick()
  if (editableElement.value) {
    restoreCursorPosition(editableElement.value, cursorPosition)
  }
}

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
    color: var.$accent;
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
    color: var.$light;
  }
}
</style>
