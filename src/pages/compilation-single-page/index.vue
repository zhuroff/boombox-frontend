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
            :tracks="compilation.tracks"
            @refetchTracklist="refetch"
          />
        </template>
      </AlbumContent>
    </transition>

    <Modal
      :isModalActive="isDeleteModalEnabled"
      @closeModal="isDeleteModalEnabled = false"
    >
      <Confirmation :message="localize('delConfirmMessage')">
        <template #actions>
          <Button
            :label="localize('delete')"
            @click="deleteEntity"
          />
          <Button
            :label="localize('cancel')"
            @click="isDeleteModalEnabled = false"
          />
        </template>
        <template #loader>
          <Loader
            v-if="isDeleting"
            mode="light"
          />
        </template>
      </Confirmation>
    </Modal>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import { AlbumContent } from '~widgets/album-content'
import { PageHeadAdapter } from '~widgets/page-heads'
import { TrackList } from '~widgets/tracklist'

import { Modal, Loader, Confirmation, Button } from '~shared/UI'
import { useDeleteEntity, useGetPage, useLocalization, useSnackbar } from '~shared/model'
import { DatabaseService } from '~shared/api'
import type { ReorderPayload } from '~shared/lib'
import type { CompilationFull } from '~entities/compilation'

const dbService = new DatabaseService()

const { localize } = useLocalization()
const { setSnackbarMessage } = useSnackbar()

const entityKey = ref('compilations')
const preRandomState = ref('')
const isDeleteModalEnabled = ref(false)
const router = useRouter()

const { data: compilation, isFetched, refetch } = useGetPage<CompilationFull>(entityKey, dbService, preRandomState)

const currentCompilationId = computed(() => compilation.value?._id || null)

const {
  deletedEntity,
  deleteEntity,
  isDeleting
} = useDeleteEntity(entityKey, currentCompilationId, dbService)

const changeTracksOrder = (payload: ReorderPayload) => {
  // emit('trackOrderChanged', payload)
}

watch(
  deletedEntity,
  (isDeleted) => {
    if (isDeleted) {
      setSnackbarMessage({
        message: localize('deletedEmbeddedMessage'),
        type: 'success'
      })
      router.push('/compilations')
    }
  }
)
</script>
