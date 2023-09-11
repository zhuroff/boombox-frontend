<template>
  <AlbumPageTemplate
    :isDataFetched="isDataFetched"
    :album="entity"
    :entityType="entityType"
    :getBooklet="() => fetchBooklet(`${entity.folderName}/booklet`)"
    :getRandomAlbum="() => getRandomAlbum(entityType)"
  ></AlbumPageTemplate>

  <!-- <section class="section">
    <transition name="fade">
      <AppPreloader v-if="!album.isFetched" mode="light" />
    </transition>

    <transition name="flyUp">
      <div v-if="album.isFetched" class="album">
        <div class="album__aside">
          <div class="album__sidebar">
            <CoverArt :albumCover="album.data.albumCover" :isBooklet="album.data.albumCoverArt?.length > 0"
              @coverClick="fetchAlbumBooklet" />

            <Button text="Add to collection" isFullWidth @onClick="callCollectionsModal" />

            <Button id="discogs" text="Get Discogs" isFullWidth :isLoading="isDiscogsLoading"
              :isDisabled="discogs.isFetched && discogs.results.size > 0" @onClick="fetchDiscogsData" />

            <FloatModal v-if="collections.isActive" :isFetched="collections.isFetched"
              :isEmpty="!collections.data.length" placeholder="Create new collection"
              @createNewEntry="createNewCollection" @closeFloatModal="closeCollectionsModal">
              <template v-slot:empty>
                <div class="float-modal__empty">
                  <strong>You haven't created any collections yet</strong>
                  <span>To create a collection, use the form below</span>
                </div>
              </template>

              <template v-slot:list>
                <ul class="float-modal__list">
                  <FloatModalItem v-for="item in collections.data" :key="item.id" :item="item" :itemID="album.data._id"
                    :isChecked="isCollectionItemChecked(item)" @checkFloatModalItem="addOrRemoveFromCollection" />
                </ul>
              </template>
            </FloatModal>
          </div>
        </div>

        <div class="album__content">
          <AlbumHeading :albumHead="albumHead" @textInputHandler="descriptionHandler" />

          <TrackList :tracks="album.data.tracks" :albumID="album.data._id" :artist="album.data.artist" />
        </div>
      </div>
    </transition>

    <transition name="fade">
      <Modal v-if="isBookletModalActive" :isModalActive="isBookletModalActive" @closeModal="closeBookletModal">
        <AppPreloader v-if="!Array.isArray(album.data.albumCoverArt)" mode="dark" />

        <Slider v-else :data="album.data.albumCoverArt" />
      </Modal>
    </transition>

    <transition name="fade">
      <DiscogsTable v-if="discogs.isFetched && discogs.results.size > 0"
        :table="Array.from(discogs.results).map((item) => item[1])" />
    </transition>
  </section> -->
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ComputedRef,
  computed,
  reactive,
  ref,
  Ref,
} from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { key } from "~/store";
import { stringEqual } from "~/shared/stringifier";
import {
  AlbumPage,
  AlbumPageProps,
  AlbumHeadProps,
  DiscogsResponse,
  DiscogsData,
} from "~/types/Album";
import { CollectionListItem } from "~/types/Collection";
import { FloatModalCheckAction } from "~/types/Global";
import AppPreloader from "~/components/Preloader/Preloader.vue";
import CoverArt from "~/components/CoverArt/CoverArt.vue";
import Button from "~/components/Button/Button.vue";
import AlbumHeading from "~/components/AlbumHeading/AlbumHeading.vue";
import TrackList from "~/components/TrackList/TrackList.vue";
import FloatModal from "~/components/FloatModal/FloatModal.vue";
import FloatModalItem from "~/components/FloatModal/FloatModalItem.vue";
import Modal from "~/components/Modal/Modal.vue";
import Slider from "~/components/Slider/Slider.vue";
import DiscogsTable from "~/components/Table/DiscogsTable.vue";
import AlbumServices from "~/services/AlbumServices";
import DiscogsServices from "~/services/DiscogsServices";
import CollectionServices from "~/services/CollectionServices";

import { useAlbumPage } from "~/hooks/useAlbumPage";
import AlbumPageTemplate from '~/templates/AlbumPageTemplate.vue'

export default defineComponent({
  name: 'AlbumPage',
  components: {
    AlbumPageTemplate
  },
  setup() {
    const {
      fetchData,
      entity,
      isDataFetched,
      fetchBooklet,
      getRandomAlbum,
      booklet
    } = useAlbumPage<AlbumPage>()

    const entityType = ref('albums')

    onMounted(() => fetchData(entityType.value))

    return {
      isDataFetched,
      entity,
      entityType,
      fetchBooklet,
      getRandomAlbum
    }

    // const route = useRoute();
    // const store = useStore(key);

    // const inputTimer: Ref<ReturnType<typeof setTimeout> | number> = ref(0);
    // const isBookletModalActive = ref(false);
    // const isDiscogsLoading = ref(false);

    // const album = reactive<AlbumPageProps>({
    //   isFetched: false,
    //   data: {} as AlbumPage,
    // });

    // const discogs = reactive<DiscogsData>({
    //   results: new Map(),
    //   isFetched: false,
    // });

    // const collections = reactive({
    //   isFetched: false,
    //   isActive: false,
    //   data: [] as CollectionListItem[],
    // });

    // const albumHead: ComputedRef<AlbumHeadProps> = computed(() => {
    //   const { title, artist, period, genre, description } = album.data;
    //   return { title, artist, period, genre, description };
    // });

    // const isCollectionItemChecked = (item: CollectionListItem) =>
    //   item.albums.some((el) => el.album._id === album.data._id);

    // const closeCollectionsModal = () => {
    //   collections.data = [];
    //   collections.isFetched = false;
    //   collections.isActive = false;
    // };

    // const setCollections = (data: CollectionListItem[]) => {
    //   collections.data = data;
    //   collections.isFetched = true;
    // };

    // const fetchCollections = () => {
    //   CollectionServices.list()
    //     .then((result) => setCollections(result))
    //     .catch((ignore) => ignore);
    // };

    // const callCollectionsModal = () => {
    //   collections.isActive = true;
    //   fetchCollections();
    // };

    // const setAlbumBooklet = (data: string[]) => {
    //   album.data.albumCoverArt = data;
    // };

    // const fetchAlbumBooklet = () => {
    //   if (Array.isArray(album.data.albumCoverArt)) {
    //     isBookletModalActive.value = true;
    //   } else if (album.data.albumCoverArt?.length) {
    //     isBookletModalActive.value = true;

    //     AlbumServices.booklet(album.data._id, album.data.albumCoverArt)
    //       .then((result) => setAlbumBooklet(result))
    //       .catch((ignore) => ignore);
    //   }
    // };

    // const closeBookletModal = () => {
    //   isBookletModalActive.value = false;
    // };

    // const createNewCollection = (title: string) => {
    //   collections.isFetched = false;

    //   CollectionServices.create(title, album.data._id)
    //     .then((result) => {
    //       store.commit("setSnackbarMessage", result);
    //       fetchCollections();
    //     })
    //     .catch((ignore) => ignore);
    // };

    // const addOrRemoveFromCollection = (payload: FloatModalCheckAction) => {
    //   CollectionServices.addRemove(collections.data, payload)
    //     .then((result) => {
    //       store.commit("setSnackbarMessage", result);
    //       fetchCollections();
    //     })
    //     .catch((ignore) => ignore);
    // };

    // const descriptionHandler = (description: string) => {
    //   if (typeof inputTimer.value === "number") {
    //     clearTimeout(inputTimer.value);
    //     inputTimer.value = setTimeout(
    //       () => AlbumServices.description(String(route.params.id), description),
    //       1000
    //     );
    //   }
    // };

    // const setAlbumState = (data: AlbumPage) => {
    //   album.data = data;
    //   album.isFetched = true;
    // };

    // const setDiscogsData = (data: DiscogsResponse) => {
    //   data.results.forEach((item) => {
    //     if (stringEqual(album.data.title, item.title.split(" - ")[1])) {
    //       discogs.results.set(item.id, item);
    //     }
    //   });
    // };

    // const fetchDiscogsData = (page = 1) => {
    //   isDiscogsLoading.value = true;

    //   DiscogsServices.discogs(album.data, page)
    //     .then((response) => {
    //       setDiscogsData(response);

    //       if (response.pagination.pages > page) {
    //         fetchDiscogsData(page + 1);
    //       } else {
    //         discogs.isFetched = true;
    //         isDiscogsLoading.value = false;
    //       }
    //     })
    //     .catch((error) => console.dir(error));
    // };

    // const fetchAlbumEntry = () => {
    //   AlbumServices.album(String(route.params.id))
    //     .then((data) => {
    //       setAlbumState(data);
    //       store.commit("setPlayerPlaylist", data);
    //     })
    //     .catch((ignore) => ignore);
    // };

    // onMounted(() => fetchAlbumEntry());

    // return {
    //   album,
    //   fetchAlbumBooklet,
    //   albumHead,
    //   descriptionHandler,
    //   callCollectionsModal,
    //   isBookletModalActive,
    //   closeBookletModal,
    //   collections,
    //   createNewCollection,
    //   closeCollectionsModal,
    //   addOrRemoveFromCollection,
    //   isCollectionItemChecked,
    //   isDiscogsLoading,
    //   fetchDiscogsData,
    //   discogs,
    // };
  },
});
</script>
