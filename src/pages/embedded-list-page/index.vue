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
import { Form } from '~shared/UI'
import type { FormPayload, FormSchemaProperty } from '~shared/model/types'

const { globalGetters: { authConfig } } = useGlobalStore()

const isCreateMode = ref(false)

const formSchema = new Map<string, FormSchemaProperty>([
  ['title', {
    id: 'album-title',
    name: 'embeddedForm.title',
    placeholder: 'embeddedForm.titlePlaceholder',
    required: true,
    type: 'text',
    label: {
      labelText: 'embeddedForm.title'
    }
  }],
  ['artist', {
    id: 'album-artist',
    name: 'embeddedForm.artist',
    placeholder: 'embeddedForm.artistPlaceholder',
    required: true,
    type: 'text',
    refKey: 'artists',
    label: {
      labelText: 'embeddedForm.artist'
    }
  }],
  ['genre', {
    id: 'album-genre',
    name: 'embeddedForm.genre',
    placeholder: 'embeddedForm.genrePlaceholder',
    required: true,
    type: 'text',
    refKey: 'genres',
    label: {
      labelText: 'embeddedForm.genre'
    }
  }],
  ['period', {
    id: 'album-period',
    name: 'embeddedForm.period',
    placeholder: 'embeddedForm.periodPlaceholder',
    required: true,
    type: 'text',
    refKey: 'periods',
    label: {
      labelText: 'embeddedForm.period'
    }
  }]
])

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
    border-radius: var.$borderRadiusSM;
    background-color: var.$paleLT;
    box-shadow: var.$shadowLight;
    padding: var.$mainPadding;
    z-index: 3000;

    .form {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 1rem;
    }
  }
}
</style>
