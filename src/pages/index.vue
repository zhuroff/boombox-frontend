<template>
  <section class="template">
    <iframe class="bandcamp" src="https://bandcamp.com/discover?s=new" />
  </section>
</template>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.bandcamp {
  height: calc(100vh - var.$playerHeight);
}
</style>
