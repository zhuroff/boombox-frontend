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
    
    <TextEditor
      :content="album.post || ''"
      :isMobile="isMobile"
      :formatConfig="editorFormatConfig"
      @updateContent="(content: string) => emit('updatePost', [content, album._id])"
    >
      <template #expand-controls="{ isExpanded, isEditMode, toggleExpanded }">
        <div 
          v-if="!isEditMode && !isExpanded"
          class="editor-expand-trigger"
          @click="toggleExpanded"
        >
          <span class="editor-expand-text">Expand article</span>
        </div>

        <div 
          v-if="!isEditMode && isExpanded"
          class="editor-collapse-trigger"
          @click="toggleExpanded"
        >
          <span class="editor-collapse-text">Collapse article</span>
        </div>
      </template>
    </TextEditor>
  </li>
</template>

<script setup lang="ts">
import { EntityCard } from '~widgets/entity-cards'
import { TextEditor, TextEditorFormatting, type TextEditorFormatConfig } from '~widgets/text-editor'
import { useDevice } from '~shared/model'
import type { CompilationAlbum } from '~/entities/collection'
import type { DeletePayload } from '~shared/lib'

type Props = {
  album: CompilationAlbum
}

type Emits = {
  (e: 'orderChanged', event: unknown): void
  (e: 'deleteEntity', payload: DeletePayload): void
  (e: 'updatePost', payload: [string, string]): void
}

const { album } = defineProps<Props>()
const emit = defineEmits<Emits>()

const { isMobile } = useDevice()

const editorFormatConfig: TextEditorFormatConfig = new Set([
  TextEditorFormatting.BOLD,
  TextEditorFormatting.ITALIC,
  TextEditorFormatting.HEADING_2,
  TextEditorFormatting.HEADING_3,
  TextEditorFormatting.BULLET_LIST,
  TextEditorFormatting.ORDERED_LIST,
  TextEditorFormatting.BLOCKQUOTE,
  TextEditorFormatting.LINK,
])
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
}

.editor-expand-trigger,
.editor-collapse-trigger {
  cursor: pointer;
  user-select: none;
  text-align: center;
  transition: opacity 0.2s ease;
  position: relative;
  top: -1rem;

  &:hover {
    opacity: 0.7;
  }
}

.editor-expand-text,
.editor-collapse-text {
  color: var.$paleDP;
  font-size: 0.875rem;

  @include var.media('<=mobile') {
    color: var.$paleLW;
  }
}
</style>