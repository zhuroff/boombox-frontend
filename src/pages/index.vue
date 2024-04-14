<template>
  <section class="section">
    <iframe class="bandcamp" src="https://bandcamp.com/discover?s=new" />
  </section>
</template>

<style lang="scss" scoped>
@import '~/scss/variables';
@import 'include-media';

.bandcamp {
  height: calc(100vh - #{$playerHeight});
}
</style>
