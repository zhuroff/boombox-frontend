<template>
  <div class="hero">
    <PosterUploader
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
            v-if="entityKey !== 'collections'"
            size="medium"
            isInverted
            :label="localize('player.waveButton')"
            :disabled="!waveAlbum?.tracks?.length"
            @click="() => {/* playWave */}"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useImageUploader, type EntityImagesKeys } from '~features/uploading'
import { PosterUploader, AvatarUploader } from '~features/uploading'
import { EditableHeading } from '~shared/UI'
import { useLocalization, useSnackbar } from '~shared/model'
import { hostString } from '~shared/utils'
// import usePlaylist from '~/~legacy/store/playlist'
import { Button } from '~shared/UI'
import { UploadService } from '~features/uploading'
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

const { localize } = useLocalization()
const { setSnackbarMessage } = useSnackbar()

const { uploadImage } = useImageUploader(props.entityKey, uploadService)

// const {
//   playerGetters: { currentPlaylist, playingTrack },
//   playerActions: { setPlayerPlaylist, togglePlayerVisibility, playTrack, continuePlay, setTrackOnPause }
// } = usePlaylist()

const waveAlbum = ref<null | any /* AlbumPage class */>(null)

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

const getCategoryWave = async () => {
  // try {
  //   const tracks = await dbServices.getEntityList<TrackRes[]>(
  //     'tracks/wave',
  //     {
  //       page: 1,
  //       limit: 50,
  //       sort: { createdAt: -1 },
  //       filter: {
  //         from: props.entityKey,
  //         key: `${categoryKeyDict[props.entityKey]}.title`,
  //         name: props.data.title
  //       }
  //     }
  //   )

  //   waveAlbum.value = new AlbumPage({
  //     _id: props.entityKey,
  //     title: `Wave by ${categoryKeyDict[props.entityKey]}: ${props.data.title}`,
  //     tracks
  //   })

  //   setPlayerPlaylist(waveAlbum.value)
  // } catch (error) {
  //   console.error(error)
  // }
}

// const playWave = () => {
//   if (!waveAlbum.value) return
//   if (!playingTrack.value?._id) {
//     playTrack(waveAlbum.value.tracks[0])
//     togglePlayerVisibility()
//   } else {
//     if (currentPlaylist.value?._id !== props.entityKey) {
//       setPlayerPlaylist(waveAlbum.value)
//       playTrack(waveAlbum.value.tracks[0])
//       togglePlayerVisibility()
//     }

//     playingTrack.value.isOnPause
//       ? continuePlay()
//       : setTrackOnPause()
//   }
// }

const host = (pathname: string) => hostString(pathname)

onMounted(() => {
  getCategoryWave()
})
</script>

<style lang="scss">
@use '~/app/styles/variables' as var;

.hero {
  width: 100%;
  height: 300px;
  position: relative;

  &:hover {

    .poster__label {
      opacity: 1;
      transition: opacity 0.3s var.$animation;
    }
  }

  &__info {
    position: absolute;
    bottom: 25px;
    left: 0;
    width: 0;
    display: flex;
    align-items: center;
    width: 100%;
  }

  &__content {
    padding: 0.5rem 25px 1rem 13rem;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: var.$transBlack;
    width: 100%;
    box-shadow: var.$shadowMedium;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
