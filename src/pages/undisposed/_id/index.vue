<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader v-if="!undisposedPage.isFetched" mode="light" />
    </transition>

    <transition name="flyUp">
      <div v-if="undisposedPage.isFetched" class="album">
        <div class="album__aside">
          <div class="album__sidebar">
            <CoverArt />
          </div>
        </div>

        <div class="album__content">
          <TrackList
            :tracks="undisposedPage.data.tracks"
            :albumID="undisposedPage.data._id"
          />
        </div>
      </div>
    </transition>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { key } from "~/store";
import AppPreloader from "~/components/Preloader/Preloader.vue";
import CoverArt from "~/components/CoverArt/CoverArt.vue";
import TrackList from "~/components/TrackList/TrackList.vue";
import AlbumServices from "~/services/AlbumServices";

export default defineComponent({
  components: {
    AppPreloader,
    CoverArt,
    TrackList,
  },

  setup() {
    const route = useRoute();
    const store = useStore(key);

    const undisposedPage = reactive({
      isFetched: false,
      data: {} as any,
    });

    const setFetchedData = (data: any) => {
      undisposedPage.isFetched = true;
      undisposedPage.data = data;
      store.commit("setPlayerPlaylist", data);
    };

    const fetchUndisposedAlbumPage = () => {
      AlbumServices.undisposedList(
        String(route.query.path),
        String(route.params.id)
      )
        .then((data) => setFetchedData(data))
        .catch((error) => console.dir(error));
    };

    onMounted(() => {
      fetchUndisposedAlbumPage();
    });

    return { undisposedPage };
  },
});
</script>
