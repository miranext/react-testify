import * as React from 'react'
import { WithChildrenProps } from '../types'
import { IWindowContext, useWindow}  from '../window/WindowContextProvider'

type HeaderEnricher = () => HeadersInit

function createRequestInit<B = any>(method: string = 'GET', body?: B, headerEnricher?: HeaderEnricher) {
  const enrichedHeaders = headerEnricher ? headerEnricher() : {}
  const requestInit: RequestInit = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...enrichedHeaders
    }
  }
  if (body) {
    requestInit.body = JSON.stringify(body)
  }
  return requestInit
}

// supported
export const Actions = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  delete: 'DELETE',
  patch: 'PATCH'
} as const

type AvailableAction = keyof typeof Actions

type WithBodyAction<R = unknown, B = unknown, P extends string = string> = (path: P, body?: B) => Promise<R>
type GetAction<R = unknown, P extends string = string> = (path: P) => Promise<R>

function handleResponse<R = unknown>(res: Response) {
  try {
    const resContentType = res.headers.get('content-type')
    if (resContentType &&
        (resContentType.indexOf('application/json') >= 0 ||
        resContentType.indexOf('text/json') >= 0)) {
      try {
        return res.json() as Promise<R>
      } catch (e) {
        return Promise.reject({ error: e, res })
      }

    } else {
      return Promise.reject({ error: new Error('Response is not json type'), res })
    }
  } catch (e) {
    return Promise.reject({ error: new Error('Unknown error caught') })
  }
}

function getFetch(ctx?: IWindowContext): FetchType {

  if (ctx) { // get from context as default
    return ctx.fetch
  }

  if (!ctx && typeof window !== 'undefined') {
    // no window context provider,
    return window.fetch
  }
  if (!ctx && typeof global !== 'undefined') {
    return global.fetch
  }

  throw new Error('Unable to determine fetch to use.')
}

function createReqBodyActionHandler<R = unknown, B = unknown, P extends string = string>(actionKey: AvailableAction, fetchProvider: FetchProvider, headerEnricher?: HeaderEnricher): WithBodyAction<R, B, P> {
  // we should fallback to global
  return async (path, body) => {
    const fetchProvided = fetchProvider()
    const res = await fetchProvided(path, createRequestInit(Actions[actionKey], body || {}, headerEnricher))
    return handleResponse(res)
  }
}

function createGetHandler<R = unknown, P extends string = string>(fetchProvider: FetchProvider, headerEnricher?: HeaderEnricher): GetAction<R, P> {

  return async (path) => {
    const fetchProvided = fetchProvider()
    return handleResponse( await fetchProvided(path, createRequestInit(Actions.get, undefined, headerEnricher)))
  }
}

export function createRequestViaWindow(windowContext: IWindowContext): Request {
  return createRequest(() => {
    return  getFetch(windowContext)
  })
}
type FetchType = typeof fetch
type FetchProvider = () => FetchType

export function createRequest(fetchProvider: FetchProvider, headerEnricher?: HeaderEnricher): Request {

  return {
    post: createReqBodyActionHandler('post', fetchProvider, headerEnricher),
    put: createReqBodyActionHandler('put', fetchProvider, headerEnricher),
    delete: createReqBodyActionHandler('delete', fetchProvider, headerEnricher),
    patch: createReqBodyActionHandler('patch', fetchProvider, headerEnricher),
    get: createGetHandler(fetchProvider, headerEnricher)
  }
}

export interface Request {
  post: WithBodyAction
  put: WithBodyAction
  delete: WithBodyAction
  patch: WithBodyAction
  get<R = unknown, P extends string = string>(path: P): Promise<R>
}

export const RequestContext = React.createContext<Request>(undefined as any as Request)

export function useRequestContext(): Request {
  return React.useContext(RequestContext)
}

export function RequestContextProvider(props: WithChildrenProps): React.ReactElement {
  const windowContext = useWindow()
  const requestContextRef = React.useRef<Request>(createRequestViaWindow(windowContext))
  return (
    <RequestContext.Provider value={requestContextRef.current}>
      { props.children }
    </RequestContext.Provider>
  )
}
