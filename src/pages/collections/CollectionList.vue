<template>
  <EntityListTemplate
    entityKey="collections"
    placeholderPreview="/img/album.webp"
    pageHeadingKey="headings.collectionsPage"
    :isDeletable="true"
  />
</template>

<script setup lang="ts">
import EntityListTemplate from '~/templates/EntityListTemplate.vue'
</script>
