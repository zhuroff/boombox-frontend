<template>
  <section class="template">
    <transition name="fade">
      <Preloader
        v-if="!isFetched"
        mode="light"
      />
    </transition>
    <transition-group name="flyUp">
      <Header
        v-if="pageHeadingKey"
        :heading="localize(pageHeadingKey, docsCount)"
        :withSearch="!!withSearch"
      >
        <slot name="header"></slot>
        <slot name="under-header"></slot>
      </Header>
      <EntityCards
        v-if="data?.docs"
        :entities="data?.docs"
        :entityKey="entityKey"
        :placeholderPreview="placeholderPreview"
      />
      <Paginator
        v-if="paginationConfig?.totalPages > 1"
        key="pagination"
        :config="paginationConfig"
        :pagination="pagination"
        :style="{ marginTop: 'auto' }"
        :updatePaginationState="updatePaginationState"
      />
    </transition-group>
  </section>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import useGlobalStore from '~/store/global'
import useEntities from '~/store/entities/useEntities'
import usePagination from '~/hooks/usePagination'
import Preloader from '~/components/Preloader.vue'
import Header from '~/components/Header.vue'
import EntityCards from '~/components/EntityCards.vue'
import Paginator from '~/components/Paginator.vue'

interface Props {
  entityKey: string
  placeholderPreview: string
  pageHeadingKey?: string
  withSearch?: boolean
}

const props = defineProps<Props>()

const { pagination, paginationConfig, updatePaginationConfig, updatePaginationState } = usePagination()
const { data, isFetched } = useEntities<BasicEntity>(props.entityKey, pagination)
const { globalGetters: { localize } } = useGlobalStore()

const docsCount = computed(() => String(data.value?.pagination.totalDocs || 0))

watchEffect(() => {
  if (isFetched.value) {
    updatePaginationConfig('totalDocs', data.value?.pagination.totalDocs || 0)
    updatePaginationConfig('totalPages', data.value?.pagination.totalPages || 0)
  }
})
</script>
