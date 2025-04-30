<template>
  <div class="hero">
    <div class="hero__poster">
      <img
        v-if="data.poster"
        :src="host(data.poster)"
        :alt="data.title"
        class="hero__poster-image"
      >
      <form
        v-if="isAdmin"
        class="hero__poster-form"
      >
        <label class="hero__poster-label">
          <input
            type="file"
            ref="posterElement"
            @change="() => saveImage('poster', posterElement)"
          >
          <Sprite name="camera" />
        </label>
      </form>
      <slot name="hero-content"></slot>
    </div>
    <div class="hero__info">
      <div
        v-if="!noAvatar"
        class="hero__avatar"
      >
        <img
          v-if="data.avatar"
          :src="host(data.avatar)"
          :alt="data.title"
          class="hero__avatar-image"
        >
        <form
          v-if="isAdmin"
          class="hero__avatar-form"
        >
          <label class="hero__avatar-label">
            <input
              type="file"
              ref="avatarElement"
              @change="() => saveImage('avatar', avatarElement)"
            >
            <Sprite name="camera" />
          </label>
        </form>
      </div>
      <div class="hero__content">
        <div class="hero__content-info">
          <input
            v-if="isEditable"
            type="text"
            class="hero__title"
            v-model="heroTitle"
          >
          <div
            v-else
            class="hero__title"
          >{{ heroTitle }}</div>
          <div class="hero__description">{{ description }}</div>
        </div>
        <div class="hero__content-actions">
          <Button
            v-if="entity !== 'collections'"
            size="medium"
            isInverted
            :label="localize('player.waveButton')"
            :disabled="!waveAlbum?.tracks?.length"
            @click="playWave"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import type { TrackRes } from '~/types/ReqRes'
import type { ImagePayload, EntityImagesKeys } from '~/types/Common'
import { hostString, categoryKeyDict } from '~/utils'
import useGlobalStore from '~/store/global'
import usePlaylist from '~/store/playlist'
import Sprite from '~/components/Sprite/Sprite.vue'
import Button from '~/components/Button.vue'
import uploadServices from '~/services/upload.services'
import dbServices from '~/services/database.services'
import AlbumPage from '~/classes/AlbumPage'

interface Props {
  data: Category
  entity: string
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

const {
  globalGetters: { localize, authConfig }
} = useGlobalStore()

const {
  playerGetters: { currentPlaylist, playingTrack },
  playerActions: { setPlayerPlaylist, togglePlayerVisibility, playTrack, continuePlay, setTrackOnPause }
} = usePlaylist()

const route = useRoute()
const posterElement: Ref<null | HTMLInputElement> = ref(null)
const avatarElement: Ref<null | HTMLInputElement> = ref(null)
const inputTimer: Ref<ReturnType<typeof setTimeout> | number> = ref(0)
const heroTitle = ref(props.data.title)
const waveAlbum = ref<null | AlbumPage>(null)

const isAdmin = computed(() => (
  authConfig.value.user?.role === 'admin'
))

const saveImage = (type: EntityImagesKeys, element: HTMLInputElement | null) => {
  if (element?.files?.length) {
    const payload: ImagePayload = {
      file: element.files[0],
      type,
      slug: props.entity,
      id: String(route.params.id)
    }

    uploadServices.uploadImage<Category>(payload)
      .then((data) => {
        // @ts-expect-error: fix
        emit('setUploadedImage', {
          key: payload.type,
          url: data[type]
        })
      })
      .catch(console.error)
  }
}

const getCategoryWave = async () => {
  try {
    const tracks = await dbServices.getEntityList<TrackRes[]>(
      'tracks/wave',
      {
        page: 1,
        limit: 50,
        sort: { createdAt: -1 },
        filter: {
          from: props.entity,
          key: `${categoryKeyDict[props.entity]}.title`,
          name: props.data.title
        }
      }
    )

    waveAlbum.value = new AlbumPage({
      _id: props.entity,
      title: `Wave by ${categoryKeyDict[props.entity]}: ${props.data.title}`,
      tracks
    })

    setPlayerPlaylist(waveAlbum.value)
  } catch (error) {
    console.error(error)
  }
}

const playWave = () => {
  if (!waveAlbum.value) return
  if (!playingTrack.value?._id) {
    // @ts-expect-error: fix
    playTrack(waveAlbum.value.tracks[0])
    togglePlayerVisibility()
  } else {
    // @ts-expect-error: fix
    if (currentPlaylist.value?._id !== props.entity) {
      setPlayerPlaylist(waveAlbum.value)
      // @ts-expect-error: fix
      playTrack(waveAlbum.value.tracks[0])
      togglePlayerVisibility()
    }

    playingTrack.value.isOnPause
      ? continuePlay()
      : setTrackOnPause()
  }
}

const host = (pathname: string) => hostString(pathname)

watch(heroTitle, (newValue) => {
  if (typeof inputTimer.value === 'number') {
    clearTimeout(inputTimer.value)

    inputTimer.value = setTimeout(() => {
      emit('saveTitle', newValue)
    }, 1000)
  }
})

onMounted(() => {
  getCategoryWave()
})
</script>

<style lang="scss">
@import '../scss/variables';
@import 'include-media';

.hero {
  width: 100%;
  height: 300px;
  position: relative;

  &:hover {

    .hero__poster-label {
      opacity: 1;
      transition: opacity 0.3s $animation;
    }
  }

  &__poster {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    &:before {
      content: '';
      background-color: $transBlack;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    &-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &-form {
      position: absolute;
      top: 0;
      right: 0;
    }

    &-label {
      width: 78px;
      height: 78px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s $animation;

      input {
        position: absolute;
        width: 0;
        height: 0;
        opacity: 0;
        outline: none;
      }

      .icon {
        color: $white;
      }
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

  &__avatar {
    margin: 0 25px;
    position: relative;
    z-index: 3;

    @include media('<tablet') {
      display: none;
    }

    @include media('>=tablet') {
      width: 10rem;
      height: 10rem;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      flex: none;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }

    &-image {
      width: 100%;
      height: 100%;
      object-fit: cover;

      & + .hero__avatar-form {
        opacity: 0;

        &:hover {
          opacity: 1;
        }
      }
    }

    &-form {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: $black;
      opacity: 1;
      transition: opacity 0.3s $animation;
    }

    &-label {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      input {
        position: absolute;
        width: 0;
        height: 0;
        opacity: 0;
        outline: none;
      }

      .icon {
        color: $white;
      }
    }
  }

  &__content {
    padding: 0.5rem 25px 1rem 13rem;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: $transBlack;
    width: 100%;
    box-shadow: $shadowMedium;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    color: $warning;
    padding: 0;
    border: 0;
    box-shadow: none;
    outline: none;
    background-color: transparent;
    width: 100%;

    @include media('<tablet') {
      @include serif(2rem);
    }

    @include media('>=tablet') {
      @include serif(3rem);
    }
  }

  &__description {
    font-weight: 600;
    color: $white;
  }
}
</style>
~/services/upload.services