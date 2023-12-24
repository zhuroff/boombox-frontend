import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: import(/* webpackChunkName: 'home' */ '~/pages/index.vue')
  },
  {
    path: '/albums',
    name: 'albums',
    component: () => import(/* webpackChunkName: 'albums' */ '~/pages/albums/index.vue'),
    children: [
      {
        path: '/albums/:id',
        name: 'album',
        component: () => import(/* webpackChunkName: 'albums' */ '~/pages/albums/index.vue')
      }
    ]
  },
  {
    path: '/embedded',
    name: 'embedded',
    component: () => import(/* webpackChunkName: 'embedded' */ '~/pages/embedded/index.vue'),
    children: [
      {
        path: '/embedded/:id',
        name: 'embed',
        component: () => import(/* webpackChunkName: 'embedded' */ '~/pages/embedded/index.vue')
      }
    ]
  },
  {
    path: '/toy',
    name: 'toy',
    component: () => import(/* webpackChunkName: 'albums' */ '~/pages/toy/index.vue'),
    children: [
      {
        path: '/toy/:genre',
        name: 'TOYGenre',
        component: () => import(/* webpackChunkName: 'albums' */ '~/pages/toy/_genre/index.vue'),
        children: [
          {
            path: '/toy/:genre/:year',
            name: 'TOYYear',
            component: () => import(/* webpackChunkName: 'albums' */ '~/pages/toy/_year/index.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/artists',
    name: 'artists',
    component: () => import(/* webpackChunkName: 'artists' */ '~/pages/artists/index.vue'),
    children: [
      {
        path: '/artists/:id',
        name: 'artist',
        component: () => import(/* webpackChunkName: 'artists' */ '~/pages/artists/index.vue')
      }
    ]
  },
  {
    path: '/genres',
    name: 'genres',
    component: () => import(/* webpackChunkName: 'genres' */ '~/pages/genres/index.vue'),
    children: [
      {
        path: '/genres/:id',
        name: 'genre',
        component: () => import(/* webpackChunkName: 'genres' */ '~/pages/genres/index.vue')
      }
    ]
  },
  {
    path: '/periods',
    name: 'periods',
    component: () => import(/* webpackChunkName: 'periods' */ '~/pages/periods/index.vue'),
    children: [
      {
        path: '/periods/:id',
        name: 'period',
        component: () => import(/* webpackChunkName: 'periods' */ '~/pages/periods/index.vue')
      }
    ]
  },
  {
    path: '/collections',
    name: 'collections',
    component: () => import(/* webpackChunkName: 'lists' */ '~/pages/collections/index.vue'),
    children: [
      {
        path: '/collections/:id',
        name: 'Collection',
        component: () => import(/* webpackChunkName: 'lists' */ '~/pages/collections/index.vue')
      }
    ]
  },
  {
    path: '/playlists',
    name: 'playlists',
    component: () => import(/* webpackChunkName: 'playlists' */ '~/pages/playlists/index.vue'),
    children: [
      {
        path: '/playlists/:id',
        name: 'Playlist',
        component: () => import(/* webpackChunkName: 'playlists' */ '~/pages/playlists/index.vue')
      }
    ]
  },
  {
    path: '/youtube',
    name: 'youtube',
    component: () => import(/* webpackChunkName: 'youtube' */ '~/pages/youtube/index.vue')
  },
  {
    path: '/radio',
    name: 'radio',
    component: () => import(/* webpackChunkName: 'radio' */ '~/pages/radio/index.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: 'radio' */ '~/pages/settings/index.vue')
  }
  // {
  //   path: '/login',
  //   name: 'Login',
  //   meta: { layout: 'AuthTemplate' },
  //   component: () => import(/* webpackChunkName: 'auth' */ '~/pages/login/index.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
