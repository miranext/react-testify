import * as React from 'react'
import { IWindowContext, useWindow}  from '../window/WindowContextProvider'

function createRemoteContext(windowContext: IWindowContext): IRemoteContext {

  async function postj<R = unknown, B = unknown>(path: string, body?: B): Promise<R> {

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
      return await res.json() as Promise<R>
    } else {
      return Promise.reject('Response is not json type')
    }
  }
  async function getj<R = unknown>(path: string): Promise<R> {
    const res = await windowContext.fetch(path, {
      method: 'POST',
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
    postj,
    getj,
    fetch: typeof window !== 'undefined' ? windowContext.fetch : undefined as any
  }
}

interface IRemoteContext {
  postj<R = unknown, B = unknown>(path: string, body?: B): Promise<R>
  getj<R = unknown>(path: string): Promise<R>
  fetch(input: RequestInfo, init?: RequestInit): Promise<Response>
}

export const RemoteContext = React.createContext<IRemoteContext>(undefined as any as IRemoteContext)

interface Props {
  children?: React.ReactNode
}

export function useRemoteContext() {
  return React.useContext(RemoteContext)
}

export function RemoteContextProvider(props: Props) {
  const windowContext = useWindow()
  console.log("?? windiw cotext ", windowContext)
  const remoteContextRef = React.useRef<IRemoteContext>(createRemoteContext(windowContext))
  return (
    <RemoteContext.Provider value={remoteContextRef.current}>
      { props.children }
    </RemoteContext.Provider>
  )
}