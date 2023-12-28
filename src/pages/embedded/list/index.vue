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
          :refs="formRefsList"
          @cleanRefsList="() => formRefsList.length = 0"
        />
      </div>
    </template>
  </ListPageTemplate>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, reactive } from 'vue'
import { JSONSchema4 } from 'json-schema'
import { EmbeddedItemRes } from '~/types/ReqRes'
import { BasicEntity } from '~/types/Common'
import { useListPage } from '~/hooks/useListPage'
import { useLocales } from '~/hooks/useLocales'
import { isObjectsEquals } from '~/utils'
import embeddedFormSchema from '~/schemas/embeddedFormSchema.json'
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
    const formRefsList = reactive<BasicEntity[]>([])

    const formSchema = embeddedFormSchema as JSONSchema4

    const pageHeading = computed(() => (
      lang(`headings.albumsPage`, pagePagination.value?.totalDocs || 0)
    ))

    watch(
      pageStateConfig,
      (newVal, oldVal) => {
        if (!isObjectsEquals(newVal, oldVal)) {
          fetchData('embedded')
            .then((payload) => {
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
      formRefsList,
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
    position: absolute;
    top: 100%;
    right: 0;
    width: 60%;
    border-radius: $borderRadiusSM;
    box-shadow: $shadowLight;
    padding: 25px;

    .form {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
