<template>
  <EntityListTemplate
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
    <template v-if="isCreateMode" #under-header>
      <div class="embedded__create">
        <Form
          :formSchema="formSchema"
          submitButtonLocale="embeddedForm.submit"
          @formSubmit="createEmbeddedAlbum"
        />
      </div>
    </template>
  </EntityListTemplate>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import EntityListTemplate from '~/templates/EntityListTemplate.vue'
// import { ref, watch, computed, reactive } from 'vue'
// import type { EmbeddedItemRes } from '~/types/ReqRes'
// import { useListPage } from '~/hooks/useListPage'
import useGlobalStore from '~/store/global'
// import { isObjectsEquals } from '~/utils'
// import dbServices from '~/services/database.services'
// import embeddedFormSchema from '~/schemas/embeddedFormSchema.json'
// import ListPageTemplate from '~/templates/ListPageTemplate.vue'
// import EmbeddedItem from '~/classes/EmbeddedItem'
// import Confirmation from '~/components/Confirmation.vue'
// import Modal from '~/components/Modal.vue'
import { Button } from '~shared/UI'
import Form from '~/components/Form/Form.vue'

// const {
//   fetchData,
//   deleteEntity,
//   isDataFetched,
//   pagePagination,
//   pageStateConfig,
//   switchPagination,
//   setEntitiesLimit
// } = useListPage<EmbeddedItemRes, EmbeddedItem>(EmbeddedItem, 'EmbeddedCard', 'embedded')

const { globalGetters: { authConfig } } = useGlobalStore()

const isCreateMode = ref(false)
// const albums = reactive<EmbeddedItem[]>([])
// const entityToDelete = ref<string | null>(null)

// const formSchema = embeddedFormSchema
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
  }]
])

const isAdmin = computed(() => (
  authConfig.value.user?.role === 'admin'
))

// const pageHeading = computed(() => (
//   localize(`headings.albumsPage`, String(pagePagination.value?.totalDocs || 0))
// ))

// const createNewEmbedded = async (formData: EmbeddedPayload) => {
//   const response = await dbServices.createEntity<EmbeddedItemRes, EmbeddedPayload>('embedded', formData)
//   albums.unshift(new EmbeddedItem(response, 'EmbeddedCard', 'embedded'))
//   isCreateMode.value = false
// }
const createEmbeddedAlbum = (formData: CustomFormData) => {
  console.log(formData)
}

// const deleteEmbedded = () => {
//   if (!entityToDelete.value) return false
//   deleteEntity('embedded', entityToDelete.value)
//     .then(() => {
//       entityToDelete.value = null
//       fetchData('embedded')
//         .then((payload) => {
//           albums.splice(0, albums.length, ...payload || [])
//         })
//     })
// }

// const delReject = () => {
//   entityToDelete.value = null
// }

// watch(
//   pageStateConfig,
//   (newVal, oldVal) => {
//     if (!isObjectsEquals(newVal, oldVal)) {
//       fetchData('embedded')
//         .then((payload) => {
//           albums.splice(0, albums.length, ...payload || [])
//         })
//     }
//   },
//   { immediate: true }
// )
</script>

<style lang="scss" scoped>
@use '~/scss/variables' as var;

.embedded {

  &__create {
    position: absolute;
    top: 100%;
    right: 0;
    width: 60%;
    border-radius: var.$borderRadiusSM;
    background-color: var.$paleLT;
    box-shadow: var.$shadowLight;
    padding: 25px;
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
