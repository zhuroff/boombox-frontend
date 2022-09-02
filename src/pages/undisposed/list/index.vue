<template>
  <div v-if="undisposedList.isFetched">
    <ul :style="{ 'padding-left': '3rem' }">
      <li
        v-for="item in undisposedList.data"
        :key="item.resource_id"
        @click="fetchContent(item.path, item.resource_id)"
        :style="{ margin: '0.5rem 0', cursor: 'pointer', 'list-style-type': 'disc' }"
      >
        <div>{{ item.name }}</div>
        <ul
          v-if="item.albums && item.albums.length > 0"
          :style="{ padding: '0.5rem 0 0.5rem 2rem' }"
        >
          <li v-for="album in item.albums" :key="album.resource_id">
            <router-link
              :to="{
                path: `/undisposed/${album.resource_id.split(':')[1]}`,
                query: { path: album.path },
              }"
              >{{ album.name }}</router-link
            >
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import AlbumServices from "~/services/AlbumServices";

export default defineComponent({
  setup() {
    const undisposedList = reactive({
      isFetched: false,
      data: [] as any,
    });

    const setFetchedData = (data: any) => {
      undisposedList.isFetched = true;
      undisposedList.data.push(...data);
    };

    const appendAlbumsToListItem = (id: string, data: any) => {
      const targetListItem = undisposedList.data.find((item: any) => item.resource_id === id);

      if (targetListItem && !targetListItem.albums?.length) {
        targetListItem.albums = data;
      }
    };

    const fetchContent = (path: string, id: string) => {
      fetchUndisposedAlbums(path, id);
    };

    const fetchUndisposedAlbums = (path?: string, id?: string) => {
      AlbumServices.undisposedList(path)
        .then((data) => {
          if (id) {
            appendAlbumsToListItem(id, data);
          } else {
            setFetchedData(data);
          }
        })
        .catch((error) => console.dir(error));
    };

    onMounted(() => fetchUndisposedAlbums());

    return {
      undisposedList,
      fetchContent,
    };
  },
});
</script>
