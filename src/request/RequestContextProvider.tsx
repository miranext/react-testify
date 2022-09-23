import * as React from 'react'
import { WithChildrenProps } from '../types'
import { IWindowContext, useWindow}  from '../window/WindowContextProvider'

function createRequestInit<B = any>(method: string = 'GET', body?: B) {
  const requestInit: RequestInit = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
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

function getFetch(ctx?: IWindowContext) {

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

function createReqBodyActionHandler<R = unknown, B = unknown, P extends string = string>(actionKey: AvailableAction, windowContext: IWindowContext): WithBodyAction<R, B, P> {
  // we should fallback to global
  return async (path, body) => {
    const res = await getFetch(windowContext)(path, createRequestInit(Actions[actionKey], body || {}))
    return handleResponse(res)
  }
}

function createGetHandler<R = unknown, P extends string = string>(windowContext: IWindowContext): GetAction<R, P> {

  return async (path) => {
    return handleResponse( await getFetch(windowContext)(path, createRequestInit(Actions.get)))
  }
}

export function createRequestContext(windowContext: IWindowContext): IRequestContext {

  return {
    post: createReqBodyActionHandler('post', windowContext),
    put: createReqBodyActionHandler('put', windowContext),
    delete: createReqBodyActionHandler('delete', windowContext),
    patch: createReqBodyActionHandler('patch', windowContext),
    get: createGetHandler(windowContext)
  }
}

interface IRequestContext {
  post: WithBodyAction
  put: WithBodyAction
  delete: WithBodyAction
  patch: WithBodyAction
  get<R = unknown, P extends string = string>(path: P): Promise<R>
}

export const RequestContext = React.createContext<IRequestContext>(undefined as any as IRequestContext)

export function useRequestContext(): IRequestContext {
  return React.useContext(RequestContext)
}

export function RequestContextProvider(props: WithChildrenProps): React.ReactElement {
  const windowContext = useWindow()
  const requestContextRef = React.useRef<IRequestContext>(createRequestContext(windowContext as IWindowContext))
  return (
    <RequestContext.Provider value={requestContextRef.current}>
      { props.children }
    </RequestContext.Provider>
  )
}
