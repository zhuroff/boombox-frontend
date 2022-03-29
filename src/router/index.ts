import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import SimpleBar from 'simplebar'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: import(/* webpackChunkName: 'home' */ '~/pages/index.vue')
  },

  {
    path: '/albums',
    name: 'Albums',
    component: () => import(/* webpackChunkName: 'albums' */ '~/pages/albums/index.vue'),
    children: [
      {
        path: '/albums/:id',
        name: 'Album',
        component: () => import(/* webpackChunkName: 'albums' */ '~/pages/albums/index.vue')
      }
    ]
  },

  {
    path: '/frames',
    name: 'Frames',
    component: () => import(/* webpackChunkName: 'frames' */ '~/pages/frames/index.vue'),
    children: [
      {
        path: '/frames/:id',
        name: 'Frame',
        component: () => import(/* webpackChunkName: 'frames' */ '~/pages/frames/index.vue')
      }
    ]
  },

  {
    path: '/artists',
    name: 'Artists',
    component: () => import(/* webpackChunkName: 'artists' */ '~/pages/artists/index.vue'),
    children: [
      {
        path: '/artists/:id',
        name: 'Artist',
        component: () => import(/* webpackChunkName: 'artists' */ '~/pages/artists/index.vue')
      }
    ]
  },

  {
    path: '/genres',
    name: 'Genres',
    component: () => import(/* webpackChunkName: 'genres' */ '~/pages/genres/index.vue'),
    children: [
      {
        path: '/genres/:id',
        name: 'Genre',
        component: () => import(/* webpackChunkName: 'genres' */ '~/pages/genres/index.vue')
      }
    ]
  },

  {
    path: '/periods',
    name: 'Periods',
    component: () => import(/* webpackChunkName: 'periods' */ '~/pages/periods/index.vue'),
    children: [
      {
        path: '/periods/:id',
        name: 'Period',
        component: () => import(/* webpackChunkName: 'periods' */ '~/pages/periods/index.vue')
      }
    ]
  },

  // {
  //   path: '/collections',
  //   name: 'Collections',
  //   component: () => import(/* webpackChunkName: 'lists' */ '~/pages/collections/index.vue')
  // },

  // {
  //   path: '/collections/:id',
  //   name: 'Collection',
  //   component: () => import(/* webpackChunkName: 'lists' */ '~/pages/collections/_id/index.vue')
  // },

  // {
  //   path: '/playlists',
  //   name: 'Playlists',
  //   component: () => import(/* webpackChunkName: 'playlists' */ '~/pages/playlists/index.vue')
  // },

  // {
  //   path: '/playlists/:id',
  //   name: 'Playlist',
  //   component: () => import(/* webpackChunkName: 'playlists' */ '~/pages/playlists/_id/index.vue')
  // },

  // {
  //   path: '/youtube',
  //   name: 'YouTube',
  //   component: () => import(/* webpackChunkName: 'youtube' */ '~/pages/youtube/index.vue')
  // },

  // {
  //   path: '/radio',
  //   name: 'Radio',
  //   component: () => import(/* webpackChunkName: 'radio' */ '~/pages/radio/index.vue')
  // },

  {
    path: '/backups',
    name: 'Backups',
    component: () => import(/* webpackChunkName: 'radio' */ '~/pages/backups/index.vue')
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

router.afterEach(() => {
  setTimeout(() => {
    const scrollSpace = document.getElementById('scrollspace')
    
    if (scrollSpace) {
      const scrollInstance = new SimpleBar(scrollSpace, { autoHide: false })
      return scrollInstance
    }
  }, 1000)
})

export default router
