<template>
  <li class="cards__album">
    <router-link
      class="cards__album-link"
      :to="{ path: `/${rootPath}/${card._id}` }"
    >
      <div class="cards__album-image">
        <img
          :src="card.avatar || placeholderImage"
          :alt="card.title"
          class="cards__album-cover"
        />
        <img
          src="/img/vinyl.png"
          alt="vinyl placeholder"
          class="cards__album-vinyl"
        />
      </div>
      <div class="cards__album-title">{{ card.title }}</div>
      <div class="cards__album-info">{{ cardCaption }}</div>
    </router-link>
    <Button
      v-if="isAdmin"
      icon="delete"
      size="small"
      className="--delete"
      isInverted
      isRounded
      @click="() => $emit('deleteEntity', card._id)"
    />
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { BasicEntity } from '~/types/Common'
import { useLocales } from '~/hooks/useLocales'
import Button from '~/components/Button.vue'
import CompilationItem from '~/classes/CompilationItem'
import store from '~/store'

export default defineComponent({
  name: 'CollectionCard',
  components: {
    Button
  },
  props: {
    card: {
      type: Object as PropType<CompilationItem<BasicEntity>>,
      required: true
    },
    rootPath: {
      type: String,
      required: true
    },
    placeholderImage: {
      type: String,
      required: true
    }
  },
  setup({ card }) {
    const { getters } = store

    const { lang } = useLocales()

    const isAdmin = computed(() => (
      getters.authConfig.value.user?.role === 'admin'
    ))

    const cardCaption = computed(() => (
      `${lang('compilations.cardCaption')}: ${card.tracks.length}`
    ))

    return {
      cardCaption,
      isAdmin
    }
  }
})
</script>
