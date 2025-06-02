import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import router from '~app/routes'
import App from '~app/App.vue'
import './app/styles/index.scss'

const app = createApp(App)

app.use(router)
app.use(VueQueryPlugin)

app.mount('#app')
