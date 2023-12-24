<template>
  <div class="tracklist__row-cell --pointer --fix">
    <Button
      icon="plus"
      size="small"
      isText
      className="tracklist__row-action"
      @click="callCompilationModal"
    />
    <!-- <FloatModal
      v-if="compilations.isActive"
      :isFetched="compilations.isFetched"
      :isEmpty="!compilations.data.length"
      placeholder="Create new playlist"
      @createNewEntry="createNewCompilation"
      @closeFloatModal="closeCompilationsModal"
    >
      <template v-slot:empty>
        <div class="float-modal__empty">
          <strong>You haven't created any compilations yet</strong>
          <span>To create a playlist, use the form below</span>
        </div>
      </template>
      <template v-slot:list>
        <ul class="float-modal__list"></ul>
      </template>
    </FloatModal> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
// import { PlaylistPayload, PlayListItem } from '~/types/Compilation'
import store from '~/store'
import Button from "~/components/Button.vue";
import api from '~/api'

export default defineComponent({
  name: 'TrackItemCompilation',
  components: {
    Button
  },
  props: {
    trackID: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { actions } = store

    // const compilations = reactive({
    //   isFetched: false,
    //   isActive: false,
    //   data: [] as PlayListItem[]
    // })

    // const isItemChecked = (item: PlayListItem) => (
    //   item.tracks.some((el) => el.track === props.trackID)
    // )

    // const setCompilations = (data: PlayListItem[]) => {
    //   compilations.data = data
    //   compilations.isFetched = true
    // }

    const fetchCompilations = async () => {
      try {
        const response = await api.get('/api/compilations')

        if (response.status === 200) {
          console.log(response)
          // setCompilations(response.data)
        }
      } catch (error) {
        throw error
      }
    }

    const callCompilationModal = () => {
      // compilations.isActive = true
      fetchCompilations()
    }

    // const closeCompilationsModal = () => {
    //   compilations.data = []
    //   compilations.isFetched = false
    //   compilations.isActive = false
    // }

    // const createNewCompilation = async (title: string) => {
    //   compilations.isFetched = false

    //   const payload: PlaylistPayload = {
    //     title,
    //     track: props.trackID
    //   }

    //   try {
    //     const response = await api.post('/api/compilations', payload)

    //     if (response?.status === 201) {
    //       actions.setSnackbarMessage({
    //         message: response.data.message,
    //         type: 'success'
    //       })

    //       fetchCompilations()
    //     }
    //   } catch (error) {
    //     throw error
    //   }
    // }

    return {
      // compilations,
      // isItemChecked,
      callCompilationModal,
      // closeCompilationsModal,
      // createNewCompilation
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables';
.tracklist__row {

  &-action {

    &:hover {
      fill: inherit;
      stroke: inherit;
      color: $white;
    }
  }
}
</style>
