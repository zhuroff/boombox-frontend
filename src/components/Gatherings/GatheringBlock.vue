<template>
  <div class="search">
    <header class="search__header">
      Collections
    </header>
    <div class="search__body">
      <div class="search__create">
        <TextInput
          name="create"
          type="text"
          size="large"
          style="padding-right: 2.5rem"
          :value="newGatheringTitle"
          :placeholder="inputPlaceholder"
          :isError="isNewGatheringTitleDuplicated"
          @onInput="(value) => newGatheringTitle = value"
        />
        <Button
          v-if="!isCreatingDisabled"
          icon="save"
          size="large"
          isText
          @click="createNewGathering"
        />
        <div
          v-if="isNewGatheringTitleDuplicated"
          class="search__error"
        >This title is already exists</div>
      </div>
      <div class="search__results">
        <Preloader
          v-if="isFetching"
          mode="light"
        />
        <div
          v-if="!gatherings?.length"
          class="search__empty"
        >
          There are no results
        </div>
        <div
          v-else
          class="search__data"
        >
          <ul class="search__block-list">
            <li
              v-for="item in coveredGatherings"
              :key="item._id"
              class="search__block-item"
              @click="selectGathering(item.isInCollection, item._id)"
            >
              <span class="search__block-action">
                <img :src="item.avatar" />
                <strong>{{ item.title }}</strong>
                <Sprite
                  :name="item.isInCollection ? 'check' : 'plus'"
                  :class="[{ '--active' : item.isInCollection }]"
                />
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { hostString } from '~/utils'
import TextInput from '../Form/TextInput.vue'
import Button from '~/components/Button.vue'
import Preloader from '~/components/Preloader.vue'
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
