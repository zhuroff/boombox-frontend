<template>
  <div ref="editorWrapper" class="editor-wrapper">
    <div v-if="editor && !isMobile && isEditMode" class="toolbar">
      <div class="toolbar__format">
        <div 
          v-if="hasAnyFormat(TextEditorFormatting.BOLD, TextEditorFormatting.ITALIC)"
          class="toolbar__group"
        >
          <button
            v-if="formatConfig.has(TextEditorFormatting.BOLD)"
            @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold') }"
            title="Жирный"
            type="button"
          >
            <strong>B</strong>
          </button>
          <button
            v-if="formatConfig.has(TextEditorFormatting.ITALIC)"
            @click="editor.chain().focus().toggleItalic().run()"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }"
            title="Курсив"
            type="button"
          >
            <i>I</i>
          </button>
        </div>
        
        <div 
          v-if="hasAnyFormat(TextEditorFormatting.HEADING_2, TextEditorFormatting.HEADING_3)"
          class="toolbar__group"
        >
          <button
            v-if="formatConfig.has(TextEditorFormatting.HEADING_2)"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
            title="Заголовок 2"
            type="button"
          >
            H2
          </button>
          <button
            v-if="formatConfig.has(TextEditorFormatting.HEADING_3)"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
            title="Заголовок 3"
            type="button"
          >
            H3
          </button>
        </div>
        
        <div 
          v-if="hasAnyFormat(TextEditorFormatting.BULLET_LIST, TextEditorFormatting.ORDERED_LIST)"
          class="toolbar__group"
        >
          <button
            v-if="formatConfig.has(TextEditorFormatting.BULLET_LIST)"
            @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'is-active': editor.isActive('bulletList') }"
            title="Маркированный список"
            type="button"
          >
            UL
          </button>
          <button
            v-if="formatConfig.has(TextEditorFormatting.ORDERED_LIST)"
            @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'is-active': editor.isActive('orderedList') }"
            title="Нумерованный список"
            type="button"
          >
            OL
          </button>
        </div>
        
        <div 
          v-if="hasAnyFormat(TextEditorFormatting.BLOCKQUOTE)"
          class="toolbar__group"
        >
          <button
            v-if="formatConfig.has(TextEditorFormatting.BLOCKQUOTE)"
            @click="editor.chain().focus().toggleBlockquote().run()"
            :class="{ 'is-active': editor.isActive('blockquote') }"
            title="Цитата"
            type="button"
          >
            Q
          </button>
        </div>
        
        <div 
          v-if="hasAnyFormat(TextEditorFormatting.LINK)"
          class="toolbar__group"
        >
          <button
            v-if="formatConfig.has(TextEditorFormatting.LINK)"
            @click="setLink"
            :class="{ 'is-active': editor.isActive('link') }"
            title="Ссылка"
            type="button"
          >
            🔗
          </button>
        </div>
      </div>
    </div>
    
    <EditorContent
      :editor="editor"
      :class="[
        { '--editable' : isEditMode },
        { '--expanded' : isExpanded },
        'editor-content'
      ]"
      @dblclick="!isEditMode && (isEditMode = true)"
    />

    <slot 
      name="expand-controls"
      :isExpanded="isExpanded"
      :isEditMode="isEditMode"
      :toggleExpanded="() => isExpanded = !isExpanded"
    />
  </div>
</template>

<script setup lang="ts">
import { watch, onUnmounted, onMounted, ref } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { debounce } from '~shared/utils'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { TextEditorFormatting, type TextEditorFormatConfig } from '../model/types'

type Props = {
  content: string
  isMobile: boolean
  placeholder?: string
  formatConfig: TextEditorFormatConfig
  defaultExpanded?: boolean
  defaultEditMode?: boolean
}

type Emits = {
  (e: 'updateContent', content: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Some description, note, or article could be here',
  defaultExpanded: false,
  defaultEditMode: false
})

const emit = defineEmits<Emits>()

const isEditMode = ref(props.defaultEditMode)
const isExpanded = ref(props.defaultExpanded)
const editorWrapper = ref<HTMLElement | null>(null)

const hasAnyFormat = (...formats: TextEditorFormatting[]) => {
  return formats.some(format => props.formatConfig.has(format))
}

const handleClickOutside = (event: MouseEvent) => {
  if (isEditMode.value && editorWrapper.value && !editorWrapper.value.contains(event.target as Node)) {
    isEditMode.value = false
  }
}

const editor = useEditor({
  content: props.content || props.placeholder,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [2, 3]
      }
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'editor-link'
      }
    })
  ],
  editorProps: {
    editable: () => isEditMode.value,
    attributes: {
      spellcheck: 'false',
    }
  },
  onUpdate: debounce(({ editor }) => {
    const content = editor.getHTML()
    emit('updateContent', content)
  }, 1000)
})

const setLink = () => {
  if (!editor.value) return

  if (editor.value.isActive('link')) {
    editor.value.chain().focus().unsetLink().run()
    return
  }

  const url = window.prompt('Введите URL:')
  
  if (url === null) {
    return
  }
  
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

watch(
  () => props.content,
  (newContent) => {
    if (editor.value && newContent !== editor.value.getHTML()) {
      editor.value.commands.setContent(newContent || props.placeholder)
    }
  }
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style scoped lang="scss">
@use '~app/styles/variables' as var;

.editor-wrapper {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: var.$fieldPadding;
  align-self: normal;

  @include var.media('<=mobile') {
    width: 100%;

    @include var.media('landscape') {
      width: auto;
    }
  }
}

.editor-content {
  flex: 1 1 0;
  position: relative;

  &.--editable {
    background-color: var.$light;

    &:deep(.tiptap) {
      padding: var.$mainPadding;
      border: 1px solid var.$paleLW;
    }
  }

  &:not(.--editable) {
    overflow: hidden;

    &:not(.--expanded) {

      @include var.media('<=mobile') {
        max-height: 0;
        padding: 0;
        max-height: 222px;
      }

      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3.5rem;
        width: 100%;
        background: linear-gradient(180deg, rgba(253, 245, 230, 0.3) 0%, rgba(253, 245, 230, 1) 90%);

        @include var.media('<=mobile') {
          display: none;
        }
      }
    }

    @include var.media('<=mobile') {
      color: var.$light;
    }
  }

  &.--expanded {
    overflow: visible;

    &:after {
      content: none;
    }
  }
}

.toolbar {
  padding: var.$fieldPadding;
  background: var.$paleLW;
  border: 1px solid var.$paleLW;
  border-radius: var.$borderRadiusMD;
  position: sticky;
  top: 0;
  z-index: 100;

  @include var.media('<=mobile') {
    gap: 0.375rem;
    padding: 0.375rem;
    top: 3.5rem;
  }

  &__actions {
    display: flex;
    gap: var.$fieldPadding;
    flex-wrap: wrap;
  }

  &__format {
    display: flex;
    gap: var.$fieldPadding;
    flex-wrap: wrap;
  }
  
  &__group {
    display: flex;
    gap: var.$fieldPadding;
    padding-right: var.$fieldPadding;
    border-right: 1px solid #ddd;

    @include var.media('<=mobile') {
      gap: 0.375rem;
      padding-right: 0.375rem;
    }
    
    &:last-child {
      border-right: none;
      padding-right: 0;
    }

    .button {
      align-self: center;
    }

    button:not(.button) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background-color: var.$light;
      border: 1px solid var.$paleLW;
      border-radius: var.$borderRadiusMD;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
      
      &:hover:not(:disabled) {
        background-color: var.$paleDP;
        border-color: var.$paleDP;
        transition: all 0.2s ease;
        color: var.$light;
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      &.is-active {
        background-color: var.$paleDP;
        color: white;
        border-color: var.$paleDP;
      }
    }
  }
}

:deep(.tiptap) {
  border-radius: var.$borderRadiusMD;
  line-height: 1.5;
  outline: none;
  font-family: var.$fontSerif;
  font-size: 1.125rem;

  @include var.media('<=mobile') {
    min-height: 50px;
  }

  @include var.media('>mobile') {
    min-height: 222px;
  }

  & > *:first-child {
    margin-top: 0 !important;
  }

  & > *:last-child {
    margin-bottom: 0 !important;
  }
  
  &:focus {
    box-shadow: var.$shadowInner;
  }
  
  h2 {
    @include var.serif(1.75rem);
    margin: var.$minPadding 0;
  }
  
  h3 {
    @include var.serif(1.5rem);
    margin: var.$minPadding 0;
  }
  
  ul, ol {
    padding-left: var.$mainPadding;
    margin: var.$fieldPadding 0;
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }
  
  li {
    margin: calc(var.$fieldPadding / 2) 0;
  }
  
  blockquote {
    border-left: 4px solid var.$paleDP;
    margin: var.$fieldPadding 0;
    font-style: italic;
    color: var.$transDark;
    background-color: var.$light;
    padding: var.$minPadding var.$mainPadding;
    border-radius: var.$borderRadiusMD;
  }
  
  a.editor-link {
    color: inherit;
    color: var.$accent;
  }
  
  p {
    margin: var.$fieldPadding 0;
  }

  i, em {
    font-style: italic;
  }
}
</style>
