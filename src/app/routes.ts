import { createRouter, createWebHistory, RouterView, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home-page',
    component: () => import(/* webpackChunkName: 'home-page' */ '~pages/home-page/index.vue')
  },
  {
    path: '/albums',
    component: RouterView,
    children: [
      {
        path: '/albums',
        name: 'album-list-page',
        meta: { navLocaleKey: 'albums' },
        component: () => import(/* webpackChunkName: 'album-list-page' */ '~pages/album-list-page/index.vue')
      },
      {
        path: '/albums/:id',
        name: 'album-single-page',
        component: () => import(/* webpackChunkName: 'album-single-page' */ '~pages/album-single-page/index.vue')
      }
    ]
  },
  {
    path: '/embedded',
    component: RouterView,
    children: [
      {
        path: '/embedded',
        name: 'embedded-list-page',
        meta: { navLocaleKey: 'embedded' },
        component: () => import(/* webpackChunkName: 'embedded-list-page' */ '~pages/embedded-list-page/index.vue')
      },
      {
        path: '/embedded/:id',
        name: 'embedded-single-page',
        component: () => import(/* webpackChunkName: 'embedded-single-page' */ '~pages/embedded-single-page/index.vue')
      }
    ]
  },
  {
    path: '/compilations',
    component: RouterView,
    children: [
      {
        path: '/compilations',
        name: 'compilation-list-page',
        meta: { navLocaleKey: 'compilations' },
        component: () => import(/* webpackChunkName: 'compilation-list-page' */ '~pages/compilation-list-page/index.vue')
      },
      {
        path: '/compilations/:id',
        name: 'compilation-single-page',
        component: () => import(/* webpackChunkName: 'compilation-single-page' */ '~pages/compilation-single-page/index.vue')
      }
    ]
  },
  {
    path: '/collections',
    component: RouterView,
    children: [
      {
        path: '/collections',
        name: 'collection-list-page',
        meta: { navLocaleKey: 'collections' },
        component: () => import(/* webpackChunkName: 'collection-list-page' */ '~pages/collection-list-page/index.vue')
      },
      {
        path: '/collections/:id',
        name: 'collection-single-page',
        component: () => import(/* webpackChunkName: 'collection-single-page' */ '~pages/collection-single-page/index.vue')
      }
    ]
  },
  {
    path: '/toy',
    meta: { navLocaleKey: 'toy' },
    component: RouterView,
    children: [
      {
        path: '/toy',
        name: 'toy-genres-page',
        component: () => import(/* webpackChunkName: 'toy-genres-page' */ '~pages/toy-genres-page/index.vue')
      },
      {
        path: '/toy/:genre',
        name: 'toy-years-page',
        component: () => import(/* webpackChunkName: 'toy-years-page' */ '~pages/toy-years-page/index.vue')
      },
      {
        path: '/toy/:genre/:id',
        name: 'toy-album-page',
        component: () => import(/* webpackChunkName: 'toy-album-page' */ '~pages/toy-album-page/index.vue')
      }
    ]
  },
  {
    path: '/artists',
    component: RouterView,
    children: [
      {
        path: '/artists',
        name: 'artist-list-page',
        meta: { navLocaleKey: 'artists' },
        component: () => import(/* webpackChunkName: 'artist-list-page' */ '~pages/artist-list-page/index.vue')
      },
      {
        path: '/artists/:id',
        name: 'artist-single-page',
        component: () => import(/* webpackChunkName: 'artist-single-page' */ '~pages/artist-single-page/index.vue')
      }
    ]
  },
  {
    path: '/genres',
    component: RouterView,
    children: [
      {
        path: '/genres',
        name: 'genre-list-page',
        meta: { navLocaleKey: 'genres' },
        component: () => import(/* webpackChunkName: 'genre-list-page' */ '~pages/genre-list-page/index.vue')
      },
      {
        path: '/genres/:id',
        name: 'genre-single-page',
        component: () => import(/* webpackChunkName: 'genre-single-page' */ '~pages/genre-single-page/index.vue')
      }
    ]
  },
  {
    path: '/periods',
    component: RouterView,
    children: [
      {
        path: '/periods',
        name: 'period-list-page',
        meta: { navLocaleKey: 'periods' },
        component: () => import(/* webpackChunkName: 'period-list-page' */ '~pages/period-list-page/index.vue')
      },
      {
        path: '/periods/:id',
        name: 'period-single-page',
        component: () => import(/* webpackChunkName: 'period-single-page' */ '~pages/period-single-page/index.vue')
      }
    ]
  },
  {
    path: '/settings',
    meta: { navLocaleKey: 'settings' },
    component: () => import(/* webpackChunkName: 'settings-page' */ '~pages/settings-page/index.vue')
  },
  {
    path: '/:unknown(.*)*',
    name: '404-page',
    component: () => import(/* webpackChunkName: '404-page' */ '~pages/404-page/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
