<template>
  <section class="template">
    <transition name="fade">
      <Loader
        v-if="!isGatheringFetched"
        mode="light"
      />
    </transition>

    <transition name="fade">
      <AlbumContent
        v-if="gathering"
        entityKey="compilations"
      >
        <template #hero>
          <PageHeadAdapter
            :album="gathering"
            @getRandomAlbum="() => preRandomState = gathering?._id || ''"
            @deleteAlbum="isDeleteModalEnabled = true"
          />
        </template>

        <template #content>
          <TrackList
            v-if="'tracks' in gathering"
            :tracks="gathering.tracks"
            :albumID="gathering._id"
            @trackOrderChanged="changeTracksOrder"
            @removeTrackFromCompilation="removeTrackFromCompilation"
          />
        </template>
      </AlbumContent>
    </transition>

    <Modal
      :isModalActive="isDeleteModalEnabled"
      @closeModal="isDeleteModalEnabled = false"
    >
      <Confirmation
        :message="localize('delConfirmMessage')"
        @confirm="isDeleteConfirmed = true"
        @reject="isDeleteModalEnabled = false"
      >
        <Loader
          v-if="isAlbumDeleting"
          mode="light"
        />
      </Confirmation>
    </Modal>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useGathering, AlbumContent } from '~widgets/album-content'
import { PageHeadAdapter } from '~widgets/page-heads'

import { Modal, Loader, Confirmation } from '~shared/UI'
import { useDeleteEntity, useSnackbar } from '~shared/model'
import { DatabaseService } from '~shared/api'

import TrackList from '~/components/TrackList/TrackList.vue'

import useGlobalStore from '~/store/global'

const dbService = new DatabaseService()

const { globalGetters: { localize } } = useGlobalStore()
const { setSnackbarMessage } = useSnackbar()

const entityKey = ref('compilations')
const isDeleteModalEnabled = ref(false)
const isDeleteConfirmed = ref(false)
const router = useRouter()

const {
  gathering,
  isGatheringFetched,
  preRandomState,
} = useGathering<Compilation>(dbService, entityKey)

const currentCompilationId = computed(() => gathering.value?._id || null)

const changeTracksOrder = (payload: ReorderPayload) => {
  // emit('trackOrderChanged', payload)
}

const removeTrackFromCompilation = (payload: GatheringUpdateReq) => {
  // emit('removeTrackFromCompilation', payload)
}

const {
  isFetched: isAlbumDeleted,
  isFetching: isAlbumDeleting
} = useDeleteEntity(entityKey, currentCompilationId, dbService, isDeleteConfirmed)

watch(
  () => isAlbumDeleted.value,
  (isDeleted) => {
    if (isDeleted) {
      setSnackbarMessage({
        message: localize('deletedEmbeddedMessage'),
        type: 'success'
      })
      router.push('/embedded')
    }
  }
)
</script>
