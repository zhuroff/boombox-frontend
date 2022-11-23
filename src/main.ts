import { createApp } from 'vue'
import router from './router'
import store, { key } from './store'
import App from '~/App.vue'
import './registerServiceWorker'

const app = createApp(App)
  .use(store, key)
  .use(router)

app.mount('#app')
