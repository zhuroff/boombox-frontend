<template>
  <ul
    v-if="!isCreateModeActive && formRefsList.length"
    class="text-input__reflist">
    <li
      v-for="item in formRefsList"
      :key="item._id"
      class="text-input__refitem"
      @click="() => selectRefItem(item)"
    >{{ item.title }}</li>
  </ul>
  <div
    v-else-if="isCreateModeActive"
    class="text-input__refcreate"
  >
    <div class="text-input__refcreate-heading">
      {{ localize('embeddedForm.notFound', refConfig.refEntityKey) }}
    </div>
    <input
      class="text-input__element --medium"
      :placeholder="'Create new'"
      v-model="newEntityInput"
    />
    <Button
      type="button"
      :label="localize('save')"
      :disabled="newEntityInput.length < 3"
      @click="createNewRefEntity"
    />
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { useSearch } from '~/hooks/useSearch'
import { BasicEntity, RefPayload } from '~/types/Common'
import { debounce } from '~/utils'
import Button from '~/components/Button.vue'
import dbServices from '~/services/database.services'
import { EmbeddedItemRes } from '~/types/ReqRes'
import useGlobalStore from '~/store/global'

interface Props {
  refConfig: RefPayload<string>
}

interface Emits {
  (e: 'selectRefItem', payload: RefPayload<BasicEntity>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  globalGetters: { localize }
} = useGlobalStore()

const { results, searchSubmit } = useSearch()
const isCreateModeActive = ref(false)
const newEntityInput = ref('')
const formRefsList = ref<BasicEntity[]>([])

const fetchSearchEntities = debounce(async (query: string, entityKey: string) => {
  try {
    await searchSubmit(query, entityKey)
    const searchResultsData = results.value.find(({ key }) => key === entityKey)?.data || []
    if (searchResultsData.length) {          
      formRefsList.value = searchResultsData?.map(({ _id, title }) => ({ _id, title })) || []
      isCreateModeActive.value = false
    } else {
      isCreateModeActive.value = true
      newEntityInput.value = props.refConfig.refEntityValue
    }
  } catch (error) {
    console.error(error)
  }
})

const selectRefItem = (item: BasicEntity) => {
  emit('selectRefItem', {
    refEntityKey: props.refConfig.refEntityKey,
    refEntityValue: item
  })
  formRefsList.value = []
}

const createNewRefEntity = async () => {
  const response = await dbServices.createEntity<
    EmbeddedItemRes,
    { value: string }
  >(props.refConfig.refEntityKey, { value: newEntityInput.value })

  response && selectRefItem({
    _id: response._id,
    title: response.title
  })
}

watch(
  props,
  ({ refConfig: { refEntityKey, refEntityValue } }) => {
    if (refEntityValue.length >= 3) {
      fetchSearchEntities(refEntityValue, refEntityKey)
    } else {
      isCreateModeActive.value = false
      formRefsList.value = []
    }
  }
)
</script>

<style lang="scss" scoped>
@import '../../scss/variables.scss';
@import 'include-media';
.text-input{
  &__reflist,
  &__refcreate {
    position: absolute;
    top: 100%;
    left: 0;
    box-shadow: $shadowMedium;
    border-radius: 0 0 $borderRadiusSM $borderRadiusSM;
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    z-index: 1000;
    background-color: $white;
  }

  &__refcreate {
    padding: 1rem;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;

    &-heading {
      flex: none;
      width: 100%;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .text-input__element {
      flex: 1 1 0;
    }
  }

  &__refitem {
    cursor: pointer;
    padding: 0.5rem 1rem;

    &:hover {
      background-color: $dark;
      color: $white;
    }
  }
}
</style>
