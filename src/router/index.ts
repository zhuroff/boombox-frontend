import { h } from 'vue'
import { createRouter, createWebHistory, RouterView } from 'vue-router'

const routes: Array<any> = [
  {
    path: '/',
    name: 'home',
    component: import(/* webpackChunkName: 'home' */ '~/pages/index.vue')
  },
  {
    path: '/albums',
    name: 'albums',
    component: () => h(RouterView),
    children: [
      {
        path: '/albums',
        name: 'album-list',
        meta: { navLocaleKey: 'albums' },
        component: () => import(/* webpackChunkName: 'album-list' */ '~/pages/albums/AlbumList.vue')
      },
      {
        path: '/albums/:id',
        name: 'album-single',
        component: () => import(/* webpackChunkName: 'album-single' */ '~/pages/albums/AlbumSingle.vue')
      }
    ]
  },
  {
    path: '/embedded',
    name: 'embedded',
    component: () => h(RouterView),
    children: [
      {
        path: '/embedded',
        name: 'embedded-list',
        meta: { navLocaleKey: 'embedded' },
        component: () => import(/* webpackChunkName: 'embedded-list' */ '~/pages/embedded/EmbeddedList.vue')
      },
      {
        path: '/embedded/:id',
        name: 'embedded-single',
        component: () => import(/* webpackChunkName: 'embedded-single' */ '~/pages/embedded/EmbeddedSingle.vue')
      }
    ]
  },
  {
    path: '/toy',
    name: 'toy-root',
    meta: { navLocaleKey: 'toy' },
    component: () => h(RouterView),
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
    name: 'artists',
    component: () => h(RouterView),
    children: [
      {
        path: '/artists',
        name: 'artist-list',
        meta: { navLocaleKey: 'artists' },
        component: () => import(/* webpackChunkName: 'artist-list' */ '~/pages/artists/ArtistList.vue')
      },
      {
        path: '/artists/:id',
        name: 'artist-single',
        component: () => import(/* webpackChunkName: 'artist-single' */ '~/pages/artists/ArtistSingle.vue')
      }
    ]
  },
  {
    path: '/genres',
    name: 'genres',
    component: () => h(RouterView),
    children: [
      {
        path: '/genres',
        name: 'genre-list',
        meta: { navLocaleKey: 'genres' },
        component: () => import(/* webpackChunkName: 'genre-list' */ '~/pages/genres/GenreList.vue')
      },
      {
        path: '/genres/:id',
        name: 'genre-single',
        component: () => import(/* webpackChunkName: 'genre-single' */ '~/pages/genres/GenreSingle.vue')
      }
    ]
  },
  {
    path: '/periods',
    name: 'periods',
    component: () => h(RouterView),
    children: [
      {
        path: '/periods',
        name: 'period-list',
        meta: { navLocaleKey: 'periods' },
        component: () => import(/* webpackChunkName: 'period-list' */ '~/pages/periods/PeriodList.vue')
      },
      {
        path: '/periods/:id',
        name: 'period-single',
        component: () => import(/* webpackChunkName: 'period-single' */ '~/pages/periods/PeriodSingle.vue')
      }
    ]
  },
  {
    path: '/collections',
    name: 'collections',
    component: () => h(RouterView),
    children: [
      {
        path: '/collections',
        name: 'collection-list',
        meta: { navLocaleKey: 'collections' },
        component: () => import(/* webpackChunkName: 'collection-list' */ '~/pages/collections/CollectionList.vue')
      },
      {
        path: '/collections/:id',
        name: 'collection-single',
        component: () => import(/* webpackChunkName: 'collection-single' */ '~/pages/collections/CollectionSingle.vue')
      }
    ]
  },
  {
    path: '/compilations',
    name: 'compilations',
    component: () => h(RouterView),
    children: [
      {
        path: '/compilations',
        name: 'compilation-list',
        meta: { navLocaleKey: 'compilations' },
        component: () => import(/* webpackChunkName: 'compilation-list' */ '~/pages/compilations/CompilationList.vue')
      },
      {
        path: '/compilations/:id',
        name: 'compilation-single',
        component: () => import(/* webpackChunkName: 'compilation-single' */ '~/pages/compilations/CompilationSingle.vue')
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
