<template>
  <transition name="fade">
    <Preloader
      v-if="isRootLoading"
      mode="light"
    />
  </transition>
  <ul
    v-if="!isRootLoading && data.size"
    class="toylist"
  >
    <TOYGenreCard
      v-for="[key, value] in data"
      :key="key"
      :card="value"
      rootPath="toy"
    />
  </ul>
  <div
    v-else-if="!isRootLoading && !data.size"
    class="toyempty"
  >{{ lang('toy.emptyGenres') }}</div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { CloudEntity } from '~/types/ReqRes'
import { useLocales } from '~/hooks/useLocales'
import Preloader from '~/components/Preloader.vue'
import TOYGenreCard from '~/components/Cards/TOYGenreCard.vue'

export default defineComponent({
  name: 'TOYRootPage',
  components: {
    Preloader,
    TOYGenreCard
  },
  props: {
    isRootLoading: {
      type: Boolean,
      required: true
    },
    data: {
      type: Map as PropType<Map<string, CloudEntity>>,
      required: true
    }
  },
  setup() {
    const { lang } = useLocales()

    return { lang }
  }
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables';

.toylist {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  height: 100%;
  padding: 25px;
}
</style>
