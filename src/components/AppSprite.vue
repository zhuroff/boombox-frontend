<template>
<!-- eslint-disable -->
<svg
  v-if="name === 'plus'"
  viewBox="0 0 24 24"
  class="icon"
>
  <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
</svg>

<svg
  v-else-if="name === 'vinyl'"
  width="24px"
  height="24px"
  viewBox="0 0 24 24"
  class="icon-vinyl"
>
  <path fill="currentColor" d="M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12,16.5C9.5,16.5 7.5,14.5 7.5,12C7.5,9.5 9.5,7.5 12,7.5C14.5,7.5 16.5,9.5 16.5,12C16.5,14.5 14.5,16.5 12,16.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
</svg>

<svg
  v-else-if="name === 'play'"
  viewBox="0 0 24 24"
  class="icon"
>
  <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
</svg>

<svg
  v-else-if="name === 'pause'"
  viewBox="0 0 24 24"
  class="icon"
>
  <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
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
  v-else-if="name === 'sound'"
  viewBox="0 0 32 32"
  class="icon"
>
  <g>
    <path d="M20.4,2.9c-0.3-0.2-0.7-0.1-1,0.1L9.7,10H3c-0.6,0-1,0.4-1,1v10c0,0.6,0.4,1,1,1h6.7l9.7,7.1c0.2,0.1,0.4,0.2,0.6,0.2   c0.2,0,0.3,0,0.5-0.1c0.3-0.2,0.5-0.5,0.5-0.9V3.8C21,3.4,20.8,3,20.4,2.9z"/>
    <path d="M27.1,9.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4C27.2,12.1,28,14,28,16s-0.8,3.9-2.3,5.3c-0.4,0.4-0.4,1,0,1.4   c0.2,0.2,0.5,0.3,0.7,0.3c0.2,0,0.5-0.1,0.7-0.3C29,20.9,30,18.6,30,16S29,11.1,27.1,9.3z"/>
    <path d="M24.7,12.7c-0.4-0.4-1-0.4-1.4,0.1c-0.4,0.4-0.3,1,0.1,1.4c0.5,0.5,0.8,1.2,0.8,1.9s-0.3,1.4-0.8,1.9   c-0.4,0.4-0.4,1-0.1,1.4c0.2,0.2,0.5,0.3,0.7,0.3c0.2,0,0.5-0.1,0.7-0.3c1-0.9,1.5-2.1,1.5-3.3S25.6,13.5,24.7,12.7z"/>
  </g>
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
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon"
>
  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
</svg>

<svg
  v-else-if="name === 'delete'"
  viewBox="0 0 60.963 60.842"
  class="icon"
>
  <path d="M59.595,52.861L37.094,30.359L59.473,7.98c1.825-1.826,1.825-4.786,0-6.611  c-1.826-1.825-4.785-1.825-6.611,0L30.483,23.748L8.105,1.369c-1.826-1.825-4.785-1.825-6.611,0c-1.826,1.826-1.826,4.786,0,6.611  l22.378,22.379L1.369,52.861c-1.826,1.826-1.826,4.785,0,6.611c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369  l22.502-22.502l22.501,22.502c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369  C61.42,57.647,61.42,54.687,59.595,52.861z"/>
</svg>

<svg
  v-else-if="name === 'burger'"
  viewBox="0 0 24 24"
  class="icon"
>
  <path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
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
  width="44"
  height="44"
  viewBox="0 0 44 44"
  stroke="#000000"
  v-else-if="name === 'spinner'"
  class="icon spinner"
>
  <g fill="none" fill-rule="evenodd" stroke-width="2">
    <circle cx="22" cy="22" r="1">
      <animate
        attributeName="r"
        begin="0s" dur="1.8s"
        values="1; 20"
        calcMode="spline"
        keyTimes="0; 1"
        keySplines="0.165, 0.84, 0.44, 1"
        repeatCount="indefinite"
      />
      <animate
        attributeName="stroke-opacity"
        begin="0s" dur="1.8s"
        values="1; 0"
        calcMode="spline"
        keyTimes="0; 1"
        keySplines="0.3, 0.61, 0.355, 1"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="22" cy="22" r="1">
      <animate
        attributeName="r"
        begin="-0.9s" dur="1.8s"
        values="1; 20"
        calcMode="spline"
        keyTimes="0; 1"
        keySplines="0.165, 0.84, 0.44, 1"
        repeatCount="indefinite"
      />
      <animate
        attributeName="stroke-opacity"
        begin="-0.9s" dur="1.8s"
        values="1; 0"
        calcMode="spline"
        keyTimes="0; 1"
        keySplines="0.3, 0.61, 0.355, 1"
        repeatCount="indefinite"
      />
    </circle>
  </g>
</svg>

<svg
  v-else-if="name === 'disable'"
  viewBox="0 0 24 24"
  class="icon"
>
  <path fill="currentColor" d="M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M12 4C10.1 4 8.4 4.6 7.1 5.7L18.3 16.9C19.3 15.5 20 13.8 20 12C20 7.6 16.4 4 12 4M16.9 18.3L5.7 7.1C4.6 8.4 4 10.1 4 12C4 16.4 7.6 20 12 20C13.9 20 15.6 19.4 16.9 18.3Z" />
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
  width="20px"
  height="18px"
  viewBox="0 0 20 18"
  class="icon"
>
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g transform="translate(-238.000000, -2770.000000)">
      <g transform="translate(100.000000, 2626.000000)">
        <g transform="translate(136.000000, 142.000000)">
          <g>
            <polygon id="Path" points="0 0 24 0 24 24 0 24"/>
            <path d="M12,15 C10.3431458,15 9,13.6568542 9,12 C9,10.3431458 10.3431458,9 12,9 C13.6568542,9 15,10.3431458 15,12 C15,13.6568542 13.6568542,15 12,15 Z M20,4 C21.1,4 22,4.9 22,6 L22,18 C22,19.1 21.1,20 20,20 L4,20 C2.9,20 2,19.1 2,18 L2,6 C2,4.9 2.9,4 4,4 L7.17,4 L8.4,2.65 C8.78,2.24 9.32,2 9.88,2 L14.12,2 C14.68,2 15.22,2.24 15.59,2.65 L16.83,4 L20,4 Z M12,17 C14.76,17 17,14.76 17,12 C17,9.24 14.76,7 12,7 C9.24,7 7,9.24 7,12 C7,14.76 9.24,17 12,17 Z" fill="#1D1D1D"/>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>

</template>

<script lang="ts">

import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true
    }
  }
})

</script>
