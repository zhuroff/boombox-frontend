<template>
  <EntityListTemplate
    entityKey="compilations"
    placeholderPreview="/img/album.webp"
    pageHeadingKey="headings.compilationsPage"
    :isDeletable="true"
  />
</template>

<script setup lang="ts">
import EntityListTemplate from '~/templates/EntityListTemplate.vue'
</script>
