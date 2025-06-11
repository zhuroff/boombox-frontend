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
          />
        </div>
      </Modal>
    </template>
  </EntityListView>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { EntityListView } from '~views/entity-list-view'
import { useCreateEntity, useSnackbar } from '~shared/model'
import { useTranslate } from '~features/localization'
import { Button } from '~shared/UI'
import { Modal } from '~shared/UI'
import { Form } from '~widgets/form'
import { embeddedAlbumFormSchema } from '~entities/embedded'
import { DatabaseService } from '~shared/api'
import { useUser } from '~entities/user'
import type { FormPayload } from '~shared/lib'

const dbService = new DatabaseService()

const { localize } = useTranslate()
const { setSnackbarMessage } = useSnackbar()

const { isAdmin } = useUser()

const isCreateMode = ref(false)
const entityKey = ref('embedded')
const formData = ref<FormPayload | null>(null)
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

watch(
  isCreatedEntityFetched,
  () => {
    setSnackbarMessage({
      message: localize('embeddedForm.entityCreated'),
      type: 'success'
    })
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
