<template>
  <li class="collection__entry">
    <EntityCard
      :card="album"
      class="--row"
      entityKey="albums"
      placeholderPreview="/img/album.webp"
      :isDraggable="true"
      :isDeletable="true"
      @deleteEntity="(payload: DeletePayload) => emit('deleteEntity', payload)"
    />
    
    <div class="editor-wrapper">
      <div v-if="editor" class="toolbar">
        <div class="toolbar-group">
          <button
            @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold') }"
            title="Жирный"
            type="button"
          >
            <strong>B</strong>
          </button>
          <button
            @click="editor.chain().focus().toggleItalic().run()"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }"
            title="Курсив"
            type="button"
          >
            <i>I</i>
          </button>
        </div>
        
        <div class="toolbar-group">
          <button
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
            title="Заголовок 2"
            type="button"
          >
            H2
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
            title="Заголовок 3"
            type="button"
          >
            H3
          </button>
        </div>
        
        <div class="toolbar-group">
          <button
            @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'is-active': editor.isActive('bulletList') }"
            title="Маркированный список"
            type="button"
          >
            UL
          </button>
          <button
            @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'is-active': editor.isActive('orderedList') }"
            title="Нумерованный список"
            type="button"
          >
            OL
          </button>
        </div>
        
        <div class="toolbar-group">
          <button
            @click="editor.chain().focus().toggleBlockquote().run()"
            :class="{ 'is-active': editor.isActive('blockquote') }"
            title="Цитата"
            type="button"
          >
            Q
          </button>
        </div>
        
        <div class="toolbar-group">
          <button
            @click="setLink"
            :class="{ 'is-active': editor.isActive('link') }"
            title="Ссылка"
            type="button"
          >
            🔗
          </button>
        </div>
      </div>
      
      <editor-content
        :editor="editor"
        class="collection__note"
      />
    </div>
  </li>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { EntityCard } from '~widgets/entity-cards'
import { debounce } from '~shared/utils'
import type { CompilationAlbum } from '~/entities/collection'
import type { DeletePayload } from '~shared/lib'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

type Props = {
  album: CompilationAlbum
}

type Emits = {
  (e: 'orderChanged', event: unknown): void
  (e: 'deleteEntity', payload: DeletePayload): void
  (e: 'updatePost', payload: [string, string]): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

const editor = useEditor({
  content: props.album.post || '',
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
    attributes: {
      spellcheck: 'false'
    }
  },
  onUpdate: debounce(({ editor }) => {
    const content = editor.getHTML()
    emit('updatePost', [content, props.album._id])
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
  () => props.album.post,
  (newContent) => {
    if (editor.value && newContent !== editor.value.getHTML()) {
      editor.value.commands.setContent(newContent || '')
    }
  }
)

onUnmounted(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style scoped lang="scss">
@use '~app/styles/variables' as var;

.collection {

  &__entry {
    display: flex;
    align-items: flex-start;
    gap: var.$mainPadding;

    @include var.media('<=mobile') {
      flex-direction: column;

      @include var.media('landscape') {
        flex-direction: row;
      }
    }

    .cardlist__item {

      @include var.media('<=mobile') {
        &.--row {
          width: 100%;

          @include var.media('landscape') {
            width: calc(33.3333% - var.$basicPadding);
          }
        }
      }

      @include var.media('>mobile', '<desktop') {
        &.--row {
          width: 33.3333%;
        }
      }

      @include var.media('>=desktop') {
        &.--row {
          width: 300px;
        }
      }
    }
  }

  &__note {
    flex: 1 1 0;
    background-color: var.$white;
  }
}

.editor-wrapper {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: var.$fieldPadding;

  @include var.media('<=mobile') {
    width: 100%;

    @include var.media('landscape') {
      width: auto;
    }
  }
}

.toolbar {
  display: flex;
  gap: var.$fieldPadding;
  padding: var.$fieldPadding;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: var.$borderRadiusMD;
  flex-wrap: wrap;

  @include var.media('<=mobile') {
    gap: 0.375rem;
    padding: 0.375rem;
  }
  
  &-group {
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
  }
  
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background-color: var.$white;
    border: 1px solid var.$paleLW;
    border-radius: var.$borderRadiusMD;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
      background-color: var.$black;
      border-color: var.$black;
      transition: all 0.2s ease;
      color: var.$paleLT;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &.is-active {
      background-color: var.$info;
      color: white;
      border-color: var.$info;
    }
  }
}

:deep(.tiptap) {
  min-height: 222px;
  padding: var.$mainPadding;
  border: 1px solid var.$paleLW;
  border-radius: var.$borderRadiusMD;
  line-height: 1.5;
  outline: none;

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
    font-size: 1.5rem;
    margin: var.$minPadding 0 var.$fieldPadding;
    font-weight: bold;
  }
  
  h3 {
    font-size: 1.25rem;
    margin: var.$minPadding 0 var.$fieldPadding;
    font-weight: bold;
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
    background-color: var.$paleLT;
    padding: var.$minPadding var.$mainPadding;
    border-radius: var.$borderRadiusMD;
  }
  
  a.editor-link {
    color: var.$info;
    text-decoration: none;
    
    &:hover {
      color: var.$info;
    }
  }
  
  p {
    margin: var.$fieldPadding 0;
  }

  i, em {
    font-style: italic;
  }
}
</style>