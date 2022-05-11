import { createApp } from 'vue'
import App from '~/App.vue'
import './registerServiceWorker'
import router from './router'
import store, { key } from './store'
import { Table } from '@oruga-ui/oruga-next'

const app = createApp(App)
  .use(store, key)
  .use(router)
  .use(Table)

app.mount('#app')
