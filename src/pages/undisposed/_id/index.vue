<template>
  <div v-if="undisposedPage.isFetched">
    <ul>
      <li
        v-for="track in undisposedPage.data"
        :key="track.resource_id"
        :style="{ 'margin-bottom': '1rem' }"
      >
        <div>
          <strong>{{ track.name }}</strong>
        </div>
        <audio :src="track.file" controls preload="none"></audio>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import AlbumServices from "~/services/AlbumServices";

export default defineComponent({
  setup() {
    const route = useRoute();

    const undisposedPage = reactive({
      isFetched: false,
      data: [] as any,
    });

    const setFetchedData = (data: any) => {
      undisposedPage.isFetched = true;
      undisposedPage.data.push(...data);
    };

    const fetchUndisposedAlbumPage = () => {
      AlbumServices.undisposedList(String(route.query.path), String(route.params.id))
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
