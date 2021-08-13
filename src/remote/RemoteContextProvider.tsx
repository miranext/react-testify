import * as React from 'react'
import { WithChildrenProps } from '../types'
import { IWindowContext, useWindow}  from '../window/WindowContextProvider'

function createRemoteContext(windowContext: IWindowContext): IRemoteContext {

  async function post<R = unknown, B = unknown>(path: string, body?: B): Promise<R> {
    try {

      const res = await windowContext.fetch(path, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body || {})
      })
      const resContentType = res.headers.get('content-type')
      if (resContentType &&
          (resContentType.indexOf('application/json') >= 0 ||
          resContentType.indexOf('text/json') >= 0)) {
        return res.json() as Promise<R>
      } else {
        return Promise.reject('Response is not json type')
      }
    } catch (e) {
      console.error(e)
    }
    return Promise.reject('Response is not json type')
  }
  async function get<R = unknown>(path: string): Promise<R> {
    const res = await windowContext.fetch(path, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const resContentType = res.headers.get('content-type')
    if (resContentType &&
        (resContentType.indexOf('application/json') >= 0 ||
         resContentType.indexOf('text/json') >= 0)) {
      return await res.json() as Promise<R>
    } else {
      return Promise.reject('Response is not json type')
    }
  }
  return {
    post,
    get
  }
}

interface IRemoteContext {
  post<R = unknown, B = unknown>(path: string, body?: B): Promise<R>
  get<R = unknown>(path: string): Promise<R>
}

export const RemoteContext = React.createContext<IRemoteContext>(undefined as any as IRemoteContext)

export function useRemoteContext(): IRemoteContext {
  return React.useContext(RemoteContext)
}

export function RemoteContextProvider(props: WithChildrenProps): React.ReactElement {
  const windowContext = useWindow()
  const remoteContextRef = React.useRef<IRemoteContext>(createRemoteContext(windowContext as IWindowContext))
  return (
    <RemoteContext.Provider value={remoteContextRef.current}>
      { props.children }
    </RemoteContext.Provider>
  )
}
