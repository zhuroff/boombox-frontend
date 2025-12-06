<template>
  <div class="hero">
    <PosterUploader
      v-if="!isMobile"
      :posterUrl="data.poster ? host(data.poster) : null"
      :entityTitle="data.title"
      @uploadPoster="uploadAndShowImage"
    />
    <div class="hero__info">
      <AvatarUploader
        v-if="!noAvatar"
        :avatarUrl="data.avatar ? host(data.avatar) : null"
        :entityTitle="data.title"
        @uploadAvatar="uploadAndShowImage"
      />
      <div class="hero__content">
        <EditableHeading
          :isEditable="!!isEditable"
          :heroTitle="props.data.title"
          :description="description"
          @saveNewTitle="(value) => emit('saveTitle', value)"
        />
        <div class="hero__content-actions">
          <Button
            size="medium"
            isInverted
            :label="localize('player.waveButton')"
            :disabled="!waveTracks?.length"
            @click="() => playTrack(waveTracks[0])"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watchEffect } from 'vue'
import { useImageUploader, type EntityImagesKeys } from '~features/uploading'
import { PosterUploader, AvatarUploader } from '~features/uploading'
import { usePlaylistService } from '~features/player'
import { useWaving } from '~features/waving'
import { usePlayer } from '~features/player'
import { EditableHeading } from '~shared/UI'
import { useDevice, useLocalization, useSnackbar } from '~shared/model'
import { hostString } from '~shared/utils'
import { Button } from '~shared/UI'
import { UploadService } from '~features/uploading'
import { DatabaseService } from '~shared/api'
import type { CategoryFull } from '~entities/category'
import type { CollectionFull } from '~entities/collection'
import type { AxiosError } from 'axios'

interface Props {
  data: CategoryFull | CollectionFull
  entityKey: string
  description: string
  noAvatar?: boolean
  isEditable?: boolean
}

interface Emits {
  (e: 'setUploadedImage', payload: { key: EntityImagesKeys, url: string }): void
  (e: 'saveTitle', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const uploadService = new UploadService()
const dbService = new DatabaseService()

const { isMobile } = useDevice()
const { localize } = useLocalization()
const { playTrack } = usePlayer()
const { setSnackbarMessage } = useSnackbar()
const { initWavePlaylist } = usePlaylistService()
const { fetchWaving, waveTracks } = useWaving(dbService)
const { uploadImage } = useImageUploader(props.entityKey, uploadService)

const uploadAndShowImage = (payload: [EntityImagesKeys, File | undefined]) => {
  const [type, file] = payload

  if (!file) {
    throw new Error('File payload is not defined')
  }

  uploadImage<EntityImagesKeys, CategoryFull>(type, file)
    .then((data) => {
      if (!data?.[type]) {
        throw new Error(`Response data or ${type} of data is not defined`)
      }

      emit('setUploadedImage', {
        key: type,
        url: data[type]
      })
    })
    .catch((error: AxiosError<{ error: string }>) => {
      const errMessage = error.response?.data.error
      setSnackbarMessage({
        message: localize(`errors.${errMessage}`),
        type: 'error'
      })
    })
}

const host = (pathname: string) => hostString(pathname)

watchEffect(() => {
  if (waveTracks.value.length) {
    initWavePlaylist(waveTracks.value)
  }
})

onMounted(() => {
  fetchWaving([props.entityKey, props.data.title])
})
</script>

<style lang="scss">
@use '~/app/styles/variables' as var;

.hero {
  width: 100%;
  position: relative;

  @include var.media('>=desktop') {
    height: 300px;
  }

  &:hover {

    .poster__label {
      opacity: 1;
      transition: opacity 0.3s var.$animation;
    }
  }

  &__info {
    width: 100%;

    @include var.media('<desktop') {
      display: flex;
      align-items: center;
    }

    @include var.media('>=desktop') {
      position: absolute;
      bottom: 25px;
      left: 0;
    }
  }

  &__content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @include var.media('<desktop') {
      flex-direction: column;
      padding: calc(110px + 1rem) 1rem 1rem 1rem;
      text-align: center;
    }

    @include var.media('>=desktop') {
      padding: 0.5rem 25px 1rem 13rem;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      box-shadow: var.$shadowMedium;
      background-color: var.$transBlack;
    }

    &-actions {

      @include var.media('<desktop') {
        margin-top: 0.75rem;
      }
    }
  }
}
</style>
