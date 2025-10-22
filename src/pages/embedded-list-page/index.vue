<template>
  <EntityListView
    entityKey="embedded"
    placeholderPreview="/img/album.webp"
    pageHeadingKey="headings.albumsPage"
    :isDeletable="true"
    :isRefresh="createdEntity && 'frame' in createdEntity"
  >
    <template #header>
      <Button
        v-if="isAdmin && !isMobile"
        icon="plus"
        :label="localize('embeddedForm.addAlbum')"
        isInverted
        :style="{ marginLeft: '1rem' }"
        @click="isCreateMode = !isCreateMode"
      />
    </template>
    <template #under-header>
      <Modal
        :isModalActive="isCreateMode"
        @closeModal="isCreateMode = false"
      >
        <div class="embedded__create">
          <Form
            :formSchema="formSchema"
            @formSubmit="createEmbeddedAlbum"
            @passRefQuery="setRefQuery"
            @resetForm="resetForm"
          >
            <template #submit>
              <Button
                type="submit"
                :label="localize('embeddedForm.submit')"
              />
            </template>
          </Form>
        </div>
        <Loader
          v-if="isCreatingEntity"
          mode="light"
        />
      </Modal>
    </template>
  </EntityListView>
  <transition name="fade">
    <Teleport
      v-if="isListOpen"
      :to="`[data-ref=${refEntityKey}]`"
    >
      <DropList
        :name="refEntityKey"
        :query="refQuery"
        :data="refList"
        :canBeCreated="canBeCreated"
        @selectOption="selectOption"
        @createNewEntity="createNewFieldEntity"
      />
    </Teleport>
  </transition>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'

import { EntityListView } from '~views/entity-list-view'

import { DatabaseService } from '~shared/api'
import { Button, Modal, DropList, Loader } from '~shared/UI'
import { useLocalization, useCreateEntity, useSnackbar, useUser, useDevice } from '~shared/model'
import type { Entity, FormPayload, SelectInputFieldSchema } from '~shared/lib'

import { embeddedAlbumFormSchema, type EmbeddedBasic } from '~entities/embedded'

import { useSearch, SearchService } from '~features/search'
import { Form } from '~features/form'

const dbService = new DatabaseService()
const searchService = new SearchService()

const { localize } = useLocalization()
const { setSnackbarMessage } = useSnackbar()
const { isMobile } = useDevice()
const { isAdmin } = useUser()

const isCreateMode = ref(false)
const entityKey = ref('embedded')
const refQuery = ref('')
const refEntityKey = ref('')
const formData = ref<FormPayload | null>(null)
const refEntityName = ref('')
const refValueSetter = ref<(payload: [string, string | File]) => void>()
const formSchema = reactive(embeddedAlbumFormSchema(localize))

const {
  createdEntity: createdEntity,
  createEntity: createNewEntity,
  isCreating: isCreatingEntity
} = useCreateEntity<Entity | EmbeddedBasic, FormPayload>(
  entityKey,
  dbService
)

const createEmbeddedAlbum = (formPayload: FormPayload) => {
  let errorCount = 0

  for (const [key] of formSchema.entries()) {
    const formPayloadValue = formPayload[key] || ''
    errorCount += formSchema.get(key)?.validator?.(formPayloadValue) || 0
  }

  if (errorCount === 0) {
    formData.value = formPayload
    isCreateMode.value = false
    createNewEntity(formData.value)
  }
}

const setRefQuery = (payload: [
  Record<string, string>,
  (payload: [string, string | File]) => void]
) => {
  const { refKey, name, value } = payload[0]
  const callback = payload[1]

  refQuery.value = value
  refEntityKey.value = refKey
  refEntityName.value = name
  refValueSetter.value = callback
}

const selectOption = (payload: SelectInputFieldSchema['options'][number]) => {
  refValueSetter.value?.([refEntityName.value, payload.value])

  const targetFormProperty = formSchema.get(refEntityName.value)

  if (targetFormProperty) {
    targetFormProperty.defaultValue = payload.label
  }

  refQuery.value = ''
  refEntityKey.value = ''
  refEntityName.value = ''
}

const createNewFieldEntity = () => {
  createNewEntity({
    value: creatingPayload.value.value,
    __entityKey: refEntityKey.value
  })
}

const resetForm = () => {
  for (const [key] of formSchema.entries()) {
    const targetFormProperty = formSchema.get(key)

    if (targetFormProperty) {
      targetFormProperty.defaultValue = ''
    }
  }
}

const creatingPayload = computed(() => ({ value: refQuery.value }))

const { searchResults, isSearchFetched } = useSearch(refQuery, searchService, refEntityKey)

const isListOpen = computed(() => (
  refQuery.value && isSearchFetched.value
))

const canBeCreated = computed(() => !!(
  refQuery.value
  && !searchResults.value?.[0]?.data.some(({ title }) => title === refQuery.value)
))

const refList = computed(() => {
  return searchResults.value?.[0]?.data.map(({ _id, title }) => ({
    label: title,
    value: _id
  })) || []
})

watch(
  createdEntity,
  (value) => {
    if (!value) return

    if ('frame' in value) {
      setSnackbarMessage({
        message: localize('embeddedForm.entityCreated'),
        type: 'success'
      })
    } else {
      selectOption({
        label: value.title,
        value: value._id
      })
    }
  }
)
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.embedded {

  &__create {
    width: 100%;
    max-width: 768px;
    max-height: calc(100vh - var.$playerHeight - var.$desktopHeaderHeight);
    border-radius: var.$borderRadiusSM;
    background-color: var.$paleLT;
    box-shadow: var.$shadowLight;
    padding: var.$mainPadding;
    z-index: 3000;
    overflow-y: auto;
  }
}
</style>
