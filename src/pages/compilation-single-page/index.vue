<template>
  <section class="template">
    <transition name="fade">
      <Loader
        v-if="!isFetched"
        mode="light"
      />
    </transition>

    <transition name="fade">
      <AlbumContent
        v-if="compilation"
        entityKey="compilations"
      >
        <template #hero>
          <PageHeadAdapter
            :album="compilation"
            @getRandomAlbum="() => preRandomState = compilation?._id || ''"
            @deleteAlbum="isDeleteModalEnabled = true"
          />
        </template>

        <template #content>
          <TrackList
            v-if="'tracks' in compilation"
            :tracks="compilation.tracks"
            :albumID="compilation._id"
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

import { AlbumContent } from '~widgets/album-content'
import { PageHeadAdapter } from '~widgets/page-heads'

import { Modal, Loader, Confirmation } from '~shared/UI'
import { useDeleteEntity, useSnackbar } from '~shared/model'
import { DatabaseService } from '~shared/api'
import { useLocalization, type ReorderPayload } from '~shared/lib'

import TrackList from '~/~legacy/components/TrackList/TrackList.vue'

import { useCompilation } from '~entities/compilation'

const dbService = new DatabaseService()

const { localize } = useLocalization()
const { setSnackbarMessage } = useSnackbar()

const entityKey = ref('compilations')
const isDeleteModalEnabled = ref(false)
const isDeleteConfirmed = ref(false)
const router = useRouter()

const {
  compilation,
  isFetched,
  preRandomState,
} = useCompilation(dbService)

const currentCompilationId = computed(() => compilation.value?._id || null)

const changeTracksOrder = (payload: ReorderPayload) => {
  // emit('trackOrderChanged', payload)
}

const removeTrackFromCompilation = (payload: any /* GatheringUpdateReq */) => {
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
