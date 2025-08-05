<template>
  <SearchWrapper isWithHeader>
    <template #header>
      Collections
    </template>
    <template #body>
      <SearchCreate
        :error="errorMessage"
        :isSaveDisabled="!!isCreatingDisabled"
        :inputValue="newGatheringTitle"
        :inputPlaceholder="inputPlaceholder"
        @passInputValue="(value) => newGatheringTitle = value"
        @createEntity="createNewGathering"
      />
      <SearchResults
        :isFetching="isFetching"
        :isEmpty="!gatherings?.length"
      >
        <template #results>
          <SearchBlock
            v-for="result in gatheringBlocks"
            :key="result.key"
            :block="result"
            :renderer="getRowComponent"
          ></SearchBlock>
        </template>
      </SearchResults>
    </template>
  </SearchWrapper>
</template>

<script setup lang="ts">
import { computed, ref, h } from 'vue'
import { hostString } from '~shared/utils'
import { SearchWrapper, SearchCreate, SearchResults, SearchBlock, type SearchResultState, type SearchResultData } from '~features/search'
import { Sprite } from '~shared/UI'
import type { CollectionBasic } from '~entities/collection'
import type { CompilationBasic } from '~entities/compilation'
import type { UpdateGatheringPayload } from '~shared/lib'

interface Props {
  isFetching: boolean
  placeholderImage: string
  entityID: string
  gatherings: CollectionBasic[] | CompilationBasic[]
  inputPlaceholder: string
}

interface Emits {
  (e: 'onCreateGathering', title: string): void
  (e: 'onSelectGathering', payload: Pick<UpdateGatheringPayload, 'isInList' | 'gatheringID'>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const newGatheringTitle = ref('')

const coveredGatherings = computed(() => (
  props.gatherings?.map((el) => ({
    ...el,
    avatar: el.avatar ? hostString(el.avatar) : props.placeholderImage,
    isInGathering: el.entities.some((id) => id === props.entityID)
  }))
))

const isCreatingDisabled = computed(() => (
  isNewGatheringTitleSmall.value || isNewGatheringTitleDuplicated.value
))

const isNewGatheringTitleSmall = computed(() => (
  newGatheringTitle.value.length < 3
))

const isNewGatheringTitleDuplicated = computed(() => (
  props.gatherings?.some(({ title }) => (
    title.toLowerCase() === newGatheringTitle.value.toLowerCase()
  ))
))

const errorMessage = computed(() => (
  isNewGatheringTitleDuplicated.value
    ? 'This title is already exists'
    : null
))

const gatheringBlocks = computed<SearchResultState[]>(() => [{
  key: 'gathering',
  data: coveredGatherings.value || []
}])

const getRowComponent = (_: string, data: SearchResultData) => {
  const isInGathering: boolean = 'isInGathering' in data ? !!data.isInGathering : false

  return h(
    'div',
    {
      class: 'search__block-action',
      onClick: () => selectGathering(isInGathering, data._id)
    },
    [
      h(
        'img',
        { src: 'avatar' in data ? data.avatar : props.placeholderImage }
      ),
      h(
        'strong',
        {},
        data.title
      ),
      h(
        Sprite,
        {
          name: isInGathering ? 'check' : 'plus',
          class: [{ '--active' : isInGathering }]
        }
      )
    ]
  )
}

const selectGathering = (isInList: boolean, gatheringID: string) => {
  emit('onSelectGathering', {
    isInList,
    gatheringID
  })
}

const createNewGathering = () => {
  emit('onCreateGathering', newGatheringTitle.value)
  newGatheringTitle.value = ''
}
</script>
