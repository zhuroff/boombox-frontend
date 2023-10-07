<template>
  <AlbumPageTemplate
    :isDataFetched="isDataFetched"
    :album="entity"
    :entityType="entityType"
    :getBooklet="() => fetchBooklet(`${entity.folderName}/booklet`)"
    :getRandomAlbum="() => getRandomAlbum(entityType)"
  />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router'
import { AlbumPage } from '~/types/Album'
import { useAlbumPage } from '~/hooks/useAlbumPage';
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

    const route = useRoute()
    const entityType = ref('albums')

    watch(
      route,
      () => fetchData(entityType.value),
      { immediate: true }
    )

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
    //   const { title, artist, period, genre } = album.data;
    //   return { title, artist, period, genre };
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
    //       store.commit('setSnackbarMessage', result);
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
