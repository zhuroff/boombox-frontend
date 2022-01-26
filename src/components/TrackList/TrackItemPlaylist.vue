<template>
  
<div
  class="tracklist__row_cell --pointer --fix"
  @click="getPlaylists"
>
  <AppSprite name="plus" />

  <AppListModal
    v-if="isModalActive"
    :data="clearfiedPlaylists"
    :itemID="trackID"
    placeholder="Create new playlist"
    @createNewList="createNewList"
    @itemAction="itemAction"
    @closeListModal="closeListModal"
  />
</div>

</template>

<script lang="ts">

import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import AppSprite from '~/components/AppSprite.vue'
import AppListModal from '~/components/AppListModal/AppListModal.vue'

export default defineComponent({
  components: {
    AppSprite,
    AppListModal
  },

  props: {
    trackID: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const store = useStore(key)
    const isModalActive = ref(false)
    const clearfiedPlaylists = computed(() => (
      // store.getters.playlists?.map((el: any) => ({
      //   id: el._id,
      //   title: el.title,
      //   items: el.tracks.map((track: any) => track.track)
      // })) || []
      []
    ))

    const getPlaylists = (event: any) => {
      console.log(event)
      // const isModalSection = event.composedPath().some((el: any) => el.className === 'applist__modal')

      // if (!isModalSection) {
      //   isModalActive.value = !isModalActive.value
      //   store.dispatch('fetchPlaylists')
      // }
    }

    const closeListModal = () => {
      isModalActive.value = false
    }

    const createNewList = (title: string) => emit('createNewList', title)

    const itemAction = (payload: any) => emit('itemAction', payload)

    return {
      isModalActive,
      clearfiedPlaylists,
      getPlaylists,
      closeListModal,
      createNewList,
      itemAction
    }
  }
})

</script>
