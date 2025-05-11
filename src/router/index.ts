import { createRouter, createWebHistory, RouterView } from 'vue-router'

const routes: Array<any> = [
  {
    path: '/',
    name: 'home-page',
    component: () => import(/* webpackChunkName: 'home-page' */ '~/pages/index.vue')
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
        component: () => import(/* webpackChunkName: 'album-single-page' */ '~/pages/album-single-page/index.vue')
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
        component: () => import(/* webpackChunkName: 'embedded-list-page' */ '~/pages/embedded-list-page/index.vue')
      },
      {
        path: '/embedded/:id',
        name: 'embedded-single-page',
        component: () => import(/* webpackChunkName: 'embedded-single-page' */ '~/pages/embedded-single-page/index.vue')
      }
    ]
  },
  {
    path: '/compilations',
    name: 'compilations',
    component: RouterView,
    children: [
      {
        path: '/compilations',
        name: 'compilation-list',
        meta: { navLocaleKey: 'compilations' },
        component: () => import(/* webpackChunkName: 'compilation-list' */ '~/pages/compilations/CompilationsList.vue')
      },
      {
        path: '/compilations/:id',
        name: 'compilation-single',
        component: () => import(/* webpackChunkName: 'compilation-single' */ '~/pages/compilations/CompilationPage.vue')
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
        component: () => import(/* webpackChunkName: 'collection-list-page' */ '~/pages/collection-list-page/index.vue')
      },
      {
        path: '/collections/:id',
        name: 'collection-single-page',
        component: () => import(/* webpackChunkName: 'collection-single-page' */ '~/pages/collection-single-page/index.vue')
      }
    ]
  },
  {
    path: '/toy',
    name: 'toy-root',
    meta: { navLocaleKey: 'toy' },
    component: RouterView,
    children: [
      {
        path: '/toy',
        name: 'toy-list',
        component: () => import(/* webpackChunkName: 'toy-list' */ '~/pages/toy/TOYList.vue')
      },
      {
        path: '/toy/:genre',
        name: 'toy-genre',
        component: () => import(/* webpackChunkName: 'toy-genre' */ '~/pages/toy/TOYGenre.vue')
      },
      {
        path: '/toy/:genre/:year',
        name: 'toy-year',
        component: () => import(/* webpackChunkName: 'toy-year' */ '~/pages/toy/TOYYear.vue')
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
        component: () => import(/* webpackChunkName: 'artist-list-page' */ '~/pages/artist-list-page/index.vue')
      },
      {
        path: '/artists/:id',
        name: 'artist-single-page',
        component: () => import(/* webpackChunkName: 'artist-single-page' */ '~/pages/artist-single-page/index.vue')
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
        component: () => import(/* webpackChunkName: 'genre-list-page' */ '~/pages/genre-list-page/index.vue')
      },
      {
        path: '/genres/:id',
        name: 'genre-single-page',
        component: () => import(/* webpackChunkName: 'genre-single-page' */ '~/pages/genre-single-page/index.vue')
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
        component: () => import(/* webpackChunkName: 'period-list-page' */ '~/pages/period-list-page/index.vue')
      },
      {
        path: '/periods/:id',
        name: 'period-single-page',
        component: () => import(/* webpackChunkName: 'period-single-page' */ '~/pages/period-single-page/index.vue')
      }
    ]
  },
  {
    path: '/settings',
    name: 'settings',
    meta: { navLocaleKey: 'settings' },
    component: () => import(/* webpackChunkName: 'settings' */ '~/pages/settings/index.vue')
  },
  {
    path: '/:unknown(.*)*',
    name: 'not-found',
    component: () => import(/* webpackChunkName: 'not-found' */ '~/pages/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
