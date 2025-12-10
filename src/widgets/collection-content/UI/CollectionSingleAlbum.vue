<template>
  <li class="collection__entry">
    <EntityCard
      :card="album"
      class="--row"
      entityKey="albums"
      placeholderPreview="/img/album.webp"
      :isDraggable="true"
      @deleteEntity="(payload: DeletePayload) => emit('deleteEntity', payload)"
    />
    
    <div class="editor-wrapper">
      <div v-if="editor && !isMobile" class="toolbar">
        <div v-if="isEditMode" class="toolbar__format">
          <div class="toolbar__group">
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
          
          <div class="toolbar__group">
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
          
          <div class="toolbar__group">
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
          
          <div class="toolbar__group">
            <button
              @click="editor.chain().focus().toggleBlockquote().run()"
              :class="{ 'is-active': editor.isActive('blockquote') }"
              title="Цитата"
              type="button"
            >
              Q
            </button>
          </div>
          
          <div class="toolbar__group">
            <button
              @click="setLink"
              :class="{ 'is-active': editor.isActive('link') }"
              title="Ссылка"
              type="button"
            >
              🔗
            </button>
          </div>

          <div class="toolbar__group">
            <Button
              label="Save"
              size="small"
              @click="isEditMode = false"
            />
          </div>
        </div>

        <div v-else class="toolbar__actions">
          <Button
            :label="isExpanded ? 'Collapse' : 'Expand'"
            size="small"
            @click="isExpanded = !isExpanded"
          />

          <Button
            label="Edit"
            size="small"
            @click="isEditMode = true"
          />

          <Button
            label="Manage"
            size="small"
            isDisabled
          />

          <Button
            label="Exclude"
            size="small"
            isDisabled
          />
        </div>
      </div>
      
      <EditorContent
        :editor="editor"
        :class="[
          { '--editable' : isEditMode },
          { '--expanded' : isExpanded || isMobile },
          'collection__note'
        ]"
      />
    </div>
  </li>
</template>

<script setup lang="ts">
import { watch, onUnmounted, ref } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { EntityCard } from '~widgets/entity-cards'
import { Button } from '~shared/UI'
import { useDevice } from '~shared/model'
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

const { isMobile } = useDevice()

const isEditMode = ref(false)
const isExpanded = ref(false)

const editor = useEditor({
  content: props.album.post || 'Some description, note, or article could be here',
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

    @include var.media('<=mobile') {
      flex-direction: column;
      gap: var.$basicPadding;

      @include var.media('landscape') {
        flex-direction: row;
      }
    }

    @include var.media('>mobile') {
      gap: var.$mainPadding;
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
    position: relative;

    &.--editable {
      background-color: var.$white;

      &:deep(.tiptap) {
        padding: var.$mainPadding;
        border: 1px solid var.$paleLW;
      }
    }

    &:not(.--editable) {
      overflow: hidden;

      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        height: 5rem;
        width: 100%;
        background: linear-gradient(180deg,rgba(238, 238, 238, 0.5) 0%, rgba(238, 238, 238, 1) 70%);
      }

      @include var.media('<=mobile') {
        color: var.$white;
      }
    }

    &.--expanded {
      overflow: visible;

      &:after {
        content: none;
      }
    }
  }
}

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

.toolbar {
  padding: var.$fieldPadding;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
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

      @include var.media('>mobile') {
        margin-left: auto;
      }
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
}

:deep(.tiptap) {
  border-radius: var.$borderRadiusMD;
  line-height: 1.5;
  outline: none;

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
    color: inherit;
    transition: color 0.2s ease;
    display: inline-block;
    position: relative;
    
    &:hover {
      color: var.$info;
      transition: color 0.2s ease;

      &:after {
        border-color: var.$info;
        transition: border-color 0.2s ease;
      }
    }

    &:after {
      content: '';
      width: 100%;
      height: 1px;
      border-top: 1px dashed var.$paleMD;
      transition: border-color 0.2s ease;
      position: absolute;
      bottom: 0.125rem;
      left: 0;
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