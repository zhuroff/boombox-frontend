<template>
  <ListPageTemplate
    cardType="EmbeddedCard"
    rootPath="albums"
    cardClass="card-box"
    placeholderImage="/img/album.webp"
    :isDataFetched="isDataFetched"
    :pageHeading="pageHeading"
    :dataList="albums"
    :pagePagination="pagePagination"
    :switchPagination="switchPagination"
    :setEntitiesLimit="setEntitiesLimit"
  >
    <template #header>
      <Button
        icon="plus"
        @click="isCreateMode = !isCreateMode"
      />
    </template>
    <template v-if="isCreateMode" #under-header>
      <div class="embedded__create">
        <Form
          :schema="formSchema"
        />
      </div>
    </template>
  </ListPageTemplate>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, reactive } from 'vue'
import { JSONSchema4 } from 'json-schema'
import { useListPage } from '~/hooks/useListPage'
import { useLocales } from '~/hooks/useLocales'
import { EmbeddedItemRes } from '~/types/ReqRes'
import { isObjectsEquals } from '~/utils'
import ListPageTemplate from '~/templates/ListPageTemplate.vue'
import EmbeddedItem from '~/classes/EmbeddedItem'
import Button from '~/components/Button.vue'
import Form from '~/components/Form.vue'

export default defineComponent({
  components: {
    ListPageTemplate,
    Button,
    Form
  },
  setup() {
    const {
      fetchData,
      isDataFetched,
      pagePagination,
      pageStateConfig,
      switchPagination,
      setEntitiesLimit
    } = useListPage<EmbeddedItemRes, EmbeddedItem>(EmbeddedItem)
    
    const { lang } = useLocales()
    const isCreateMode = ref(false)
    const albums = ref<EmbeddedItem[]>([])

    const formSchema: JSONSchema4 = reactive({
      type: 'object',
      title: 'Embedded form',
      properties: {
        title: {
          type: 'string',
          title: lang('embeddedForm.title'),
          required: true
        },
        artist: {
          type: 'array',
          title: lang('embeddedForm.artist'),
          required: true,
          maxItems: 1,
          minItems: 1,
          $ref: 'artists',
          items: {
            type: 'object'
          }
        },
        genre: {
          type: 'array',
          title: lang('embeddedForm.genre'),
          required: true,
          maxItems: 1,
          minItems: 1,
          $ref: 'genres',
          items: {
            type: 'object'
          }
        },
        period: {
          type: 'array',
          title: lang('embeddedForm.period'),
          required: true,
          maxItems: 1,
          minItems: 1,
          $ref: 'periods',
          items: {
            type: 'object'
          }
        },
        frame: {
          type: 'string',
          title: lang('embeddedForm.frame'),
          required: true,
          element: 'textarea'
        },
        inCollections: {
          type: 'array',
          title: lang('embeddedForm.inCollections'),
          $ref: 'collections',
          items: {
            type: 'object'
          }
        }
      }
    })

    const pageHeading = computed(() => (
      lang(`headings.albumsPage`, pagePagination.value?.totalDocs || 0)
    ))

    watch(
      pageStateConfig,
      (newVal, oldVal) => {
        if (!isObjectsEquals(newVal, oldVal)) {
          fetchData('embedded')
            .then((payload) => {
              console.log(payload)
              albums.value = payload || []
            })
        }
      },
      { immediate: true }
    )

    return {
      albums,
      formSchema,
      pageHeading,
      isCreateMode,
      pagePagination,
      isDataFetched,
      switchPagination,
      setEntitiesLimit
    }

  }
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables';
@import 'include-media';

.embedded {
  &__create {
    width: 100%;
  }
}
</style>
