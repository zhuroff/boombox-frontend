<template>
  
<div class="tracklist__row_cell --pointer --fix">
  <button
    class="tracklist__row_action"
    @click="callPlaylistsModal"
  >
    <AppSprite name="plus" />
  </button>

  <FloatModal
    v-if="playlists.isActive"
    :isFetched="playlists.isFetched"
    :isEmpty="!playlists.data.length"
    placeholder="Create new playlist"
    @createNewEntry="createNewPlaylist"
    @closeFloatModal="closePlaylistModal"
  >
    <template v-slot:empty>
      <div class="float-modal__empty">
        <strong>You haven't created any playlists yet</strong>
        <span>To create a playlist, use the form below</span>
      </div>
    </template>

    <template v-slot:list>
      <ul class="float-modal__list">
        <FloatModalItem
          v-for="item in playlists.data"
          :key="item.id"
          :item="item"
          :itemID="trackID"
          :isChecked="isItemChecked(item)"
          @checkFloatModalItem="playlistItemAction"
        />
      </ul>
    </template>
  </FloatModal>
</div>

</template>

<script lang="ts">

import { defineComponent, reactive } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import { IPlaylistPayloadPost, PlayListItem } from '~/types/Playlist'
import { IFloatModalCheckAction } from '~/types/Global'
import AppSprite from '~/components/AppSprite.vue'
import FloatModal from '~/components/FloatModal/FloatModal.vue'
import FloatModalItem from '~/components/FloatModal/FloatModalItem.vue'
import api from '~/api'

export default defineComponent({
  components: {
    AppSprite,
    FloatModal,
    FloatModalItem
  },

  props: {
    trackID: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const store = useStore(key)

    const playlists = reactive({
      isFetched: false,
      isActive: false,
      data: [] as PlayListItem[]
    })

    const isItemChecked = (item: PlayListItem) => (
      item.tracks.some((el) => el.track === props.trackID)
    )

    const setPlaylists = (data: PlayListItem[]) => {
      playlists.data = data
      playlists.isFetched = true
    }

    const fetchPlaylists = async () => {
      try {
        const response = await api.get('/api/playlists')

        if (response.status === 200) {
          setPlaylists(response.data)
        }
      } catch (error) {
        throw error
      }
    }

    const callPlaylistsModal = () => {
      playlists.isActive = true
      fetchPlaylists()
    }

    const closePlaylistModal = () => {
      playlists.data = []
      playlists.isFetched = false
      playlists.isActive = false
    }

    const createNewPlaylist = async (title: string) => {
      playlists.isFetched = false

      const payload: IPlaylistPayloadPost = {
        title,
        track: props.trackID
      }

      try {
        const response = await api.post('/api/playlists', payload)

        if (response?.status === 200) {
          store.commit('setSnackbarMessage', {
            message: response.data.message,
            type: 'success'
          })
          
          fetchPlaylists()
        }
      } catch (error) {
        throw error
      }
    }

    const playlistItemAction = async (payload: IFloatModalCheckAction) => {
      const targetPlaylist = playlists.data.find((playlist) => (
        playlist._id === payload.listID
      ))

      if (targetPlaylist) {
        payload.order = Math.max(...targetPlaylist.tracks.map((track) => (
          track.order
        ))) + 1

        try {
          const response = await api.patch(`/api/playlists/${payload.listID}`, payload)

          if (response?.status === 200) {
            store.commit('setSnackbarMessage', {
              message: response.data.message,
              type: 'success'
            })

            fetchPlaylists()
          }
        } catch (error) {
          throw error
        }
      }
    }

    return {
      playlists,
      isItemChecked,
      callPlaylistsModal,
      closePlaylistModal,
      createNewPlaylist,
      playlistItemAction
    }
  }
})

</script>
