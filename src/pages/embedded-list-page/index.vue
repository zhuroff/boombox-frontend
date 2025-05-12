<template>
  <EntityListView
    entityKey="embedded"
    placeholderPreview="/img/album.webp"
    pageHeadingKey="headings.albumsPage"
    :isDeletable="true"
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
import { ref, computed } from 'vue'
import { EntityListView } from '~widgets/EntityListView'
import useGlobalStore from '~/store/global'
import { Button } from '~shared/UI'
import { Modal } from '~shared/UI'
import { Form } from '~widgets/Form'
import type { FormPayload } from '~widgets/Form/model/types'
import { embeddedAlbumFormSchema } from '~entities/embedded'

const { globalGetters: { authConfig } } = useGlobalStore()

const isCreateMode = ref(false)

const formSchema = embeddedAlbumFormSchema

const isAdmin = computed(() => (
  authConfig.value.user?.role === 'admin'
))

const createEmbeddedAlbum = (formData: FormPayload) => {
  console.log(formData)
}
</script>

<style lang="scss" scoped>
@use '~/scss/variables' as var;

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
