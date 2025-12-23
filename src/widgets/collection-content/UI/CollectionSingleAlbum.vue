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
      <template #toolbar-format-actions="{ toggleEditMode }">
        <div class="toolbar__group">
          <Button
            label="Save"
            size="small"
            @click="toggleEditMode"
          />
        </div>
      </template>

      <template #toolbar-actions="{ isExpanded, toggleExpanded, toggleEditMode }">
        <div class="toolbar__actions">
          <Button
            :label="isExpanded ? 'Collapse' : 'Expand'"
            size="small"
            @click="toggleExpanded"
          />

          <Button
            label="Edit"
            size="small"
            @click="toggleEditMode"
          />

          <Button
            label="Manage"
            size="small"
            isDisabled
          />

          <Button
            label="Exclude"
            size="small"
            @click="() => emit('excludeAlbum', album._id)"
          />
        </div>
      </template>
    </TextEditor>
  </li>
</template>

<script setup lang="ts">
import { EntityCard } from '~widgets/entity-cards'
import { TextEditor, TextEditorFormatting, type TextEditorFormatConfig } from '~widgets/text-editor'
import { Button } from '~shared/UI'
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
  (e: 'excludeAlbum', id: string): void
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

.toolbar__actions {
  display: flex;
  gap: var.$fieldPadding;
  flex-wrap: wrap;
}
</style>