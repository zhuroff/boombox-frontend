/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface EmbeddedPayload {
  artist: string
  frame: string
  genre: string
  period: string
  title: string
}
