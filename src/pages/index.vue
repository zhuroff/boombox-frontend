<template>
  <section class="template">
    <KeepAlive>
      <iframe class="bandcamp" src="https://bandcamp.com/discover?s=new" />
    </KeepAlive>
  </section>
</template>

<style lang="scss" scoped>
@use '~/scss/variables' as var;

.bandcamp {
  height: calc(100vh - var.$playerHeight);
}
</style>
