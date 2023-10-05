<template>
<!-- eslint-disable -->
<svg
  v-if="name === 'vinyl'"
  width="24px"
  height="24px"
  viewBox="0 0 24 24"
  class="icon-vinyl"
>
  <path fill="currentColor" d="M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12,16.5C9.5,16.5 7.5,14.5 7.5,12C7.5,9.5 9.5,7.5 12,7.5C14.5,7.5 16.5,9.5 16.5,12C16.5,14.5 14.5,16.5 12,16.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
</svg>

<svg
  v-else-if="name === 'repeat'"
  width="16px"
  height="18px"
  viewBox="0 0 16 18"
  class="icon"
>
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g transform="translate(-302.000000, -7080.000000)" fill="#ffffff">
      <g transform="translate(56.000000, 160.000000)">
        <path d="M260,6930 C260,6933 257.308,6936 254,6936 C250.692,6936 248,6933.308 248,6930 C248,6926.692 250.692,6924 254,6924 L254,6926 L259,6923 L254,6920 L254,6922 C249.582,6922 246,6925.582 246,6930 C246,6934.418 249.582,6938 254,6938 C258.418,6938 262,6935 262,6930 L260,6930 Z" id="arrow_repeat-[#236]"/>
      </g>
    </g>
  </g>
</svg>

<svg
  v-else-if="name === 'repeat-active'"
  width="16px"
  height="18px"
  viewBox="0 0 16 18"
  class="icon"
>
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g transform="translate(-302.000000, -7080.000000)" fill="#f51e38">
      <g transform="translate(56.000000, 160.000000)">
        <path d="M260,6930 C260,6933 257.308,6936 254,6936 C250.692,6936 248,6933.308 248,6930 C248,6926.692 250.692,6924 254,6924 L254,6926 L259,6923 L254,6920 L254,6922 C249.582,6922 246,6925.582 246,6930 C246,6934.418 249.582,6938 254,6938 C258.418,6938 262,6935 262,6930 L260,6930 Z" id="arrow_repeat-[#236]"/>
      </g>
    </g>
  </g>
</svg>

<svg
  v-else-if="name === 'next'"
  width="24px"
  height="24px"
  viewBox="0 0 24 24"
  class="icon"
>
  <path fill="currentColor" d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z" />
</svg>

<svg
  v-else-if="name === 'previous'"
  width="24px"
  height="24px"
  viewBox="0 0 24 24"
  class="icon"
>
  <path fill="currentColor" d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z" />
</svg>

<svg
  v-else-if="name === 'sync'"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  class="icon"
>
  <path fill="currentColor" d="M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z" />
</svg>

<svg
  v-else-if="name === 'volume'"
  viewBox="0 0 24 24"
  class="icon"
>
  <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
</svg>

<svg
  v-else-if="name === 'volume-off'"
  viewBox="0 0 24 24"
  class="icon"
>
    <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
</svg>

<svg
  v-else-if="name === 'youtube'"
  viewBox="0 0 24 24"
  class="icon"
>
  <path fill="currentColor" d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z" />
</svg>

<svg
  v-else-if="name === 'delete'"
  viewBox="0 0 24 24"
  class="icon"
>
  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
</svg>

<svg
  v-else-if="name === 'burger'"
  viewBox="0 0 24 24"
  class="icon"
>
  <path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
</svg>

<svg
  v-else-if="name === 'save'"
  viewBox="0 0 24 24"
  width="24"
  height="24"
  class="icon-save"
>
  <path fill="none" d="M0 0h24v24H0z"/>
  <path d="M4 3h14l2.707 2.707a1 1 0 0 1 .293.707V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm3 1v5h9V4H7zm-1 8v7h12v-7H6zm7-7h2v3h-2V5z" fill="#000"/>
</svg>

<svg
  width="55"
  height="80"
  viewBox="0 0 55 80"
  fill="#000"
  class="icon playing"
  v-else-if="name === 'playing'"
>
  <g transform="matrix(1 0 0 -1 0 80)">
    <rect width="10" height="20" rx="3">
      <animate
        attributeName="height"
        begin="0s" dur="4.3s"
        values="20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20"
        calcMode="linear"
        epeatCount="indefinite"
      />
    </rect>
    <rect x="15" width="10" height="80" rx="3">
      <animate
        attributeName="height"
        begin="0s" dur="2s"
        values="80;55;33;5;75;23;73;33;12;14;60;80"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </rect>
    <rect x="30" width="10" height="50" rx="3">
      <animate
        attributeName="height"
        begin="0s" dur="1.4s"
        values="50;34;78;23;56;23;34;76;80;54;21;50"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </rect>
    <rect x="45" width="10" height="30" rx="3">
      <animate
        attributeName="height"
        begin="0s" dur="2s"
        values="30;45;13;80;56;72;45;76;34;23;67;30"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </rect>
  </g>
</svg>

<svg
  v-else-if="name === 'remove'"
  viewBox="0 0 64 58.67"
  class="icon"
>
  <g id="Layer_2" data-name="Layer 2">
    <g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M61.33,5.33H48V2.67A2.66,2.66,0,0,0,45.33,0H18.67A2.66,2.66,0,0,0,16,2.67V5.33H2.67a2.67,2.67,0,0,0,0,5.34H8v40a8,8,0,0,0,8,8H48a8,8,0,0,0,8-8v-40h5.33a2.67,2.67,0,1,0,0-5.34ZM50.67,50.67A2.67,2.67,0,0,1,48,53.33H16a2.67,2.67,0,0,1-2.67-2.66v-40H50.67Z"/><path class="cls-1" d="M24,45.33a2.67,2.67,0,0,0,2.67-2.66V21.33a2.67,2.67,0,0,0-5.34,0V42.67A2.67,2.67,0,0,0,24,45.33Z"/>
      <path class="cls-1" d="M40,45.33a2.67,2.67,0,0,0,2.67-2.66V21.33a2.67,2.67,0,0,0-5.34,0V42.67A2.67,2.67,0,0,0,40,45.33Z"/>
    </g>
  </g>
</svg>

<svg
  v-else-if="name === 'angle'"
  width="24px"
  height="24px"
  viewBox="0 0 24 24"
  class="icon"
>
  <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
</svg>

<svg
  v-else-if="name === 'camera'"
  viewBox="0 0 24 24"
  width="24px"
  height="24px"
  class="icon"
>
  <path fill="currentColor" d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
</svg>

<component :is="IconComponent" />

</template>

<script lang="ts">

import { computed, defineComponent } from 'vue'
import SpriteEllipsis from './SpriteEllipsis.vue'
import SpritePlay from './SpritePlay.vue'
import SpriteDisable from './SpriteDisable.vue'
import SpriteSpinner from './SpriteSpinner.vue'
import SpritePause from './SpritePause.vue'
import SpritePlus from './SpritePlus.vue'

export default defineComponent({
  name: 'Sprite',

  components: {
    SpritePlay,
    SpriteEllipsis,
    SpriteDisable,
    SpriteSpinner,
    SpritePause,
    SpritePlus
  },

  props: {
    name: {
      type: String,
      required: true
    }
  },

  setup({ name }) {
    const IconsMap = new Map([
      ['ellipsis', SpriteEllipsis],
      ['play', SpritePlay],
      ['disable', SpriteDisable],
      ['spinner', SpriteSpinner],
      ['pause', SpritePause],
      ['plus', SpritePlus]
    ])

    const IconComponent = computed(() => (
      IconsMap.get(name) || null
    ))

    return { IconComponent }
  }
})

</script>
