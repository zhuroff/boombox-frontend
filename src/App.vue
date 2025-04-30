<template>
  <div
    v-if="isAuthChecking"
    class="app-preloading"
  >
    <Preloader mode="light" />
  </div>
  <component
    v-else
    :is="layout"
  >
    <router-view />
  </component>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import api from '~/api'
import useGlobalStore from '~/store/global'
import Preloader from '~/components/Preloader.vue'
import MainTemplate from '~/templates/MainTemplate.vue'
import UnauthTemplate from '~/templates/UnauthTemplate.vue'

const {
  globalActions: { checkAndSetLocale, setAuthConfig },
  globalGetters: { isAuthenticated }
} = useGlobalStore()

const isAuthChecking = computed(() => (
  typeof isAuthenticated.value === 'undefined'
))

const layout = computed(() => (
  isAuthenticated.value ? MainTemplate : UnauthTemplate
))

const syncMessage = localStorage.getItem('syncMessage')

if (syncMessage) {
  localStorage.removeItem('syncMessage')
}

const checkAuthentication = async () => {
  try {
    const { data } = await api.get<AuthRefreshResponse>('api/users/refresh')

    localStorage.setItem('token', data.accessToken)
    setAuthConfig('isAuthenticated', true)
    setAuthConfig('user', data.user)
  } catch (error) {
    console.error(error)
    localStorage.removeItem('token')
    setAuthConfig('isAuthenticated', false)
    setAuthConfig('user', undefined)
  }
}

onMounted(() => {
  checkAndSetLocale()
  checkAuthentication()
})
</script>

<style lang="scss">
@use '~/scss/variables' as var;
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@200..1000&family=Yeseva+One&display=swap');

html, object, img, ins, kbd, q, s, samp, strike, strong, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  vertical-align: baseline;
}

article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
  display: block;
}

iframe {
  border: 0;
}

h1, h2, h3, h4, h5, h6, p, blockquote {
  margin: 0;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  margin-top: 0;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  margin: 0;
  padding: 0;
}

@-ms-viewport {
  width: device-width;
}

body {
  text-rendering: geometricPrecision;
  -webkit-font-smoothing: antialiased;
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
  margin: 0;
  padding: 0;
  font-family: var.$font;
  font-size: 1rem;
  letter-spacing: 0.5px;
}

[tabindex="-1"]:focus {
  outline: 0 !important;
}

hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 0;
  margin-bottom: 0;
}

p {
  margin-top: 0;
  margin-bottom: 0;
}

ul, dl {
  list-style: none;
  margin: 0;
  padding: 0;
}

ol {
  margin: 0;
}

blockquote:before,
blockquote:after,
q:before,
q:after {
  content: '';
  content: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

th {
  text-align: inherit;
}

img {
  -ms-interpolation-mode: bicubic;
}

a {
  cursor: pointer;
}

a,
a:hover,
a:focus {
  text-decoration: none;
  text-decoration-skip-ink: auto;
}

pre {
  margin: 0;
  overflow: auto;
}

img {
  vertical-align: middle;
  border-style: none;
}

svg {
  overflow: hidden;
  vertical-align: middle;
}

label {
  display: inline-block;
}

input,
textarea {
  box-shadow: none !important;
  margin: 0;
  border-radius: 0;
  font-family: var.$font;
}

input[type=text],
input[type="number"],
input[type="email"],
input[type="button"],
input[type="tel"],
input[type="search"],
textarea,
select {
  box-shadow: none !important;
  margin: 0;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

[type="search"] {
  outline-offset: -2px;
}

[type="search"]::-webkit-search-cancel-button,
[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}

textarea {
  overflow: auto;
  resize: none;
}

select {
  font-family: var.$font;

  &::-ms-expand {
    display: none;
  }
}

button,
[type="button"],
[type="reset"],
[type="submit"] {
  font-family: var.$font;
  cursor: pointer;
}

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  padding: 0;
  border-style: none;
}

address,
cite, em {
  font-style: normal;
}

fieldset {
  min-width: 0;
}

legend {
  display: block;
  width: 100%;
  max-width: 100%;
  line-height: inherit;
  color: inherit;
  white-space: normal;
}

progress {
  vertical-align: baseline;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes appearance {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.flyUp-enter-active,
.flyUp-leave-active {
  transition: all 0.5s var.$animation;
}

.flyUp-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.flyUp-enter-from,
.flyUp-leave-to {
  transform: translateY(50px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  opacity: 0;
  transition: all 0.5s var.$animation;
}

.fade-enter-to {
  position: absolute;
  opacity: 1;
}

.fade-enter-from,
.fade-leave-to {
  position: absolute;
  opacity: 0;
}

.template {
  min-height: calc(100vh - var.$playerHeight);
  display: flex;
  flex-direction: column;
}

.app-preloading {
  background-color: var.$white;
  position: absolute;
  z-index: 9000;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.--small {
  font-size: .75rem;
  height: var.$elementHeightSM;
  border-radius: var.$borderRadiusSM;
}

.--medium {
  font-size: .875rem;
  height: var.$elementHeightMD;
  border-radius: var.$borderRadiusMD;
}

.--large {
  font-size: 1rem;
  height: var.$elementHeightLG;
  border-radius: var.$borderRadiusLG;
}

.--error {
  border-color: var.$error;
}
</style>
