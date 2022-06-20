import { createApp } from 'vue'
import router from './router'
import store, { key } from './store'
import App from '~/App.vue'
import { Table } from '@oruga-ui/oruga-next'
import './registerServiceWorker'

const app = createApp(App)
  .use(store, key)
  .use(router)
  .use(Table)

app.mount('#app')
