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
import { hostString } from '~/utils'
import SearchWrapper from '~/components/Search/SearchWrapper.vue'
import SearchCreate from '~/components/Search/SearchCreate.vue'
import SearchResults from '~/components/Search/SearchResults.vue'
import SearchBlock from '~/components/Search/SearchBlock.vue'
import Sprite from '~/components/Sprite/Sprite.vue'

interface Props {
  isFetching: boolean
  placeholderImage: string
  albumId: string | undefined
  gatherings: GatheringBasic[] | undefined
  inputPlaceholder: string
}

interface Emits {
  (e: 'onCreateGathering', title: string): void
  (e: 'onSelectGathering', payload: Pick<GatheringUpdateReq, 'isInList' | 'gatheringID'>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const newGatheringTitle = ref('')

const coveredGatherings = computed(() => (
  props.gatherings?.map((el) => ({
    ...el,
    avatar: el.avatar ? hostString(el.avatar) : props.placeholderImage,
    isInCollection: el.entities.some((id) => id === props.albumId)
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

const getRowComponent = (key: string, data: any) => {
  return h(
    'div',
    {
      class: 'search__block-action',
      onClick: () => selectGathering(data.isInCollection, data._id)
    },
    [
      h(
        'img',
        { src: data.avatar }
      ),
      h(
        'strong',
        {},
        data.title
      ),
      h(
        Sprite,
        {
          name: data.isInCollection ? 'check' : 'plus',
          class: [{ '--active' : data.isInCollection }]
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
