<template>
  <ListPageTemplate
    placeholderImage="/img/album.webp"
    :isDataFetched="isDataFetched"
    :pageHeading="pageHeading"
    :dataList="albums"
    :pagePagination="pagePagination"
    :switchPagination="switchPagination"
    :setEntitiesLimit="setEntitiesLimit"
    @deleteEntity="(id) => entityToDelete = id"
  >
    <template #header>
      <Button
        v-if="isAdmin"
        icon="plus"
        isText
        @click="isCreateMode = !isCreateMode"
      />
    </template>
    <template v-if="isCreateMode" #under-header>
      <div class="embedded__create">
        <Form
          :schema="formSchema"
          @formSubmit="createNewEmbedded"
        />
      </div>
    </template>
    <template #modal>
      <Modal
        v-if="entityToDelete"
        :isModalActive="entityToDelete !== null"
        @closeModal="delReject"
      >
        <Confirmation
          :message="lang('delConfirmMessage')"
          @confirm="deleteEmbedded"
          @reject="delReject"
        />
      </Modal>
    </template>
  </ListPageTemplate>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, reactive } from 'vue'
import { JSONSchema4 } from 'json-schema'
import { EmbeddedItemRes } from '~/types/ReqRes'
import { useListPage } from '~/hooks/useListPage'
import { useLocales } from '~/hooks/useLocales'
import { isObjectsEquals } from '~/utils'
import store from '~/store'
import dbServices from '~/services/database.services'
import embeddedFormSchema from '~/schemas/embeddedFormSchema.json'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'
import EmbeddedItem from '~/classes/EmbeddedItem'
import Confirmation from '~/components/Confirmation.vue'
import Modal from '~/components/Modal.vue'
import Button from '~/components/Button.vue'
import Form from '~/components/Form.vue'

export default defineComponent({
  components: {
    ListPageTemplate,
    Confirmation,
    Button,
    Modal,
    Form
  },
  setup() {
    const {
      fetchData,
      deleteEntity,
      isDataFetched,
      pagePagination,
      pageStateConfig,
      switchPagination,
      setEntitiesLimit
    } = useListPage<EmbeddedItemRes, EmbeddedItem>(EmbeddedItem, 'EmbeddedCard', 'embedded')
    
    const { getters } = store
    const { lang } = useLocales()
    const isCreateMode = ref(false)
    const albums = reactive<EmbeddedItem[]>([])
    const entityToDelete = ref<string | null>(null)

    const formSchema = embeddedFormSchema as JSONSchema4

    const isAdmin = computed(() => (
      getters.authConfig.value.user?.role === 'admin'
    ))

    const pageHeading = computed(() => (
      lang(`headings.albumsPage`, String(pagePagination.value?.totalDocs || 0))
    ))

    const createNewEmbedded = async (formData: EmbeddedPayload) => {
      const response = await dbServices.createEntity<EmbeddedItemRes, EmbeddedPayload>('embedded', formData)
      albums.unshift(new EmbeddedItem(response, 'EmbeddedCard', 'embedded'))
      isCreateMode.value = false
    }

    const deleteEmbedded = () => {
      if (!entityToDelete.value) return false
      deleteEntity('embedded', entityToDelete.value)
        .then(() => {
          entityToDelete.value = null
          fetchData('embedded')
            .then((payload) => {
              albums.splice(0, albums.length, ...payload || [])
            })
        })
    }

    const delReject = () => {
      entityToDelete.value = null
    }

    watch(
      pageStateConfig,
      (newVal, oldVal) => {
        if (!isObjectsEquals(newVal, oldVal)) {
          fetchData('embedded')
            .then((payload) => {
              albums.splice(0, albums.length, ...payload || [])
            })
        }
      },
      { immediate: true }
    )

    return {
      lang,
      albums,
      isAdmin,
      delReject,
      formSchema,
      pageHeading,
      entityToDelete,
      isCreateMode,
      deleteEmbedded,
      pagePagination,
      isDataFetched,
      switchPagination,
      setEntitiesLimit,
      createNewEmbedded
    }

  }
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables';
@import 'include-media';
.embedded {
  &__create {
    position: absolute;
    top: 100%;
    right: 0;
    width: 60%;
    border-radius: $borderRadiusSM;
    background-color: $white;
    box-shadow: $shadowLight;
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
