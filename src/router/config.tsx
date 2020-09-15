import { lazy } from 'react';
import SuspenseComponent from './SuspenseCompoent'

export interface Route {
  path: string
  component: any,
  key?: string | number
  exact?: boolean
  strict?: boolean,
  children?: Routes
  meta?: {
    [key: string]: any
  }
}

export type Routes = Route[]

const routes: Routes = [
  {
    path: '/recommon',
    component: SuspenseComponent(lazy(/* webpackChunkName: 'Recommon' */() => import('../pages/Recommon'))),
    meta: {
      title: 'recommon'
    }
  },
  {
    path: '/singer',
    component: SuspenseComponent(lazy(/* webpackChunkName: 'singer' */() => import('../pages/Singer'))),
    meta: {
      title: 'singer'
    }
  },
  {
    path: '/rank',
    component: SuspenseComponent(lazy(/* webpackChunkName: 'rank' */() => import('../pages/Ranks'))),
    meta: {
      title: 'rank'
    }
  },
  {
    path: '/singerdetail/:id',
    component: SuspenseComponent(lazy(/* webpackChunkName: 'singerDetail' */() => import('../pages/SingerDetail'))),
    meta: {
      title: 'rank'
    }
  },
  {
    path: '/albumdetail/:id',
    component: SuspenseComponent(lazy(/* webpackChunkName: 'AlbumDetail' */() => import('../pages/AlbumDetail'))),
    meta: {
      title: 'rank'
    }
  },
  {
    path: '*',
    component: SuspenseComponent(lazy(/* webpackChunkName: recommon */() => import('../pages/Recommon'))),
  }
]

export default routes
