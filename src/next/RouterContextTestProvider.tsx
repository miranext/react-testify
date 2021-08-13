import * as React from 'react'
import { RouterContext } from 'next/dist/shared/lib/router-context'
import { NextRouter } from 'next/dist/client/router'

function createNextRouter(partial: Partial<NextRouter> = {}) {
  const ourRouter: NextRouter = {
    asPath: '/',
    route: '/',
    pathname: '/',
    basePath: '/',
    isLocaleDomain: true,
    query: {},
    back() {
      // noops
    },
    beforePopState() {
      // noops
    },
    prefetch() {
      return Promise.resolve(void 0)
    },
    push() {
      return Promise.resolve(true)
    },
    reload() {
      // noops
    },
    replace() {
      return Promise.resolve(true)
    },
    isFallback: false,
    isReady: false,
    isPreview: false,
    events: {
      on() {
        // noops
      },
      off()  {
        // noops
      },
      emit() {
        //noops
      }
    }
  }
  const nextRouter: NextRouter = {
    ...ourRouter,
    ...partial
  }

  return nextRouter
}

export interface Props {
  router?: Partial<NextRouter>
  children: React.ReactNode
}

export function RouterContextTestProvider(props: Props): React.ReactElement {

  const nextRouterRef = React.useRef<NextRouter>(createNextRouter(props.router))
  return (
    <RouterContext.Provider value={nextRouterRef.current}>
      { props.children }
    </RouterContext.Provider>
  )
}
