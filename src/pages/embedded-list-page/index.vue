<template>
  <EntityListView
    entityKey="embedded"
    placeholderPreview="/img/album.webp"
    pageHeadingKey="headings.albumsPage"
    :isDeletable="true"
    :isRefresh="isCreatedEntityFetched"
  >
    <template #header>
      <Button
        v-if="isAdmin"
        icon="plus"
        label="embeddedForm.addAlbum"
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
            submitButtonLocale="embeddedForm.submit"
            @formSubmit="createEmbeddedAlbum"
            @passRefQuery="setRefQuery"
          />
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
        @createNewEntity="createNewEntity"
      />
    </Teleport>
  </transition>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'

import { EntityListView } from '~views/entity-list-view'

import { DatabaseService } from '~shared/api'
import { Button, Modal, Form, DropList, Loader } from '~shared/UI'
import { useLocalization, useCreateEntity, useSnackbar } from '~shared/model'
import type { Entity, FormPayload, SelectInputFieldSchema } from '~shared/lib'

import { useUser } from '~entities/user'
import { embeddedAlbumFormSchema } from '~entities/embedded'

import { useSearch, SearchService } from '~features/search'

const dbService = new DatabaseService()
const searchService = new SearchService()

const { localize } = useLocalization()
const { setSnackbarMessage } = useSnackbar()

const { isAdmin } = useUser()

const isCreateMode = ref(false)
const entityKey = ref('embedded')
const refQuery = ref('')
const refEntityKey = ref('')
const formData = ref<FormPayload | null>(null)
const isNewEntityQueryEnabled = ref(false)
const refEntityName = ref('')
const refValueSetter = ref<(payload: [string, string | File]) => void>()
const formSchema = reactive(embeddedAlbumFormSchema)

const isCreatingEnabled = computed(() => !!formData.value)

const {
  isFetched: isCreatedEntityFetched
} = useCreateEntity<any, FormPayload>(
  entityKey,
  formData,
  dbService,
  isCreatingEnabled
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

const createNewEntity = () => {
  isNewEntityQueryEnabled.value = true
}

const creatingPayload = computed(() => ({ value: refQuery.value }))

const { searchResults, isSearchFetched } = useSearch(refQuery, searchService, refEntityKey)

const {
  data: createdEntity,
  isFetching: isCreatingEntity
} = useCreateEntity<Entity, { value: string }>(
  refEntityKey,
  creatingPayload,
  dbService,
  isNewEntityQueryEnabled
)

const isListOpen = computed(() => (
  refQuery.value && isSearchFetched.value && !isNewEntityQueryEnabled.value
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
  isCreatedEntityFetched,
  () => {
    setSnackbarMessage({
      message: localize('embeddedForm.entityCreated'),
      type: 'success'
    })
  }
)

watch(
  createdEntity,
  (newVal) => {
    if (newVal) {
      isNewEntityQueryEnabled.value = false
      selectOption({
        label: newVal.title,
        value: newVal._id
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
