import { describe, expect, it, vi } from 'vitest'
import { createRequest, createRequestViaWindow } from '../../src/request/RequestContextProvider'
import { IWindowContext } from '../../src/window/WindowContextProvider'

describe('request context tests', () => {

  it('any unexpected error is caught and rethrown', async () => {
    const fetch = vi.fn()

    const api = createRequest(() => fetch)
    const vals = Object.values(api)

    for (const fn of vals) {
      try {
        await fn('/somewhere')
        throw new Error('Should have thrown')
      } catch (e) {
        expect(e.error).toBeDefined()
      }
    }
  })

  it('passes body as stringified and return json body', async () => {
    const fetchMock = async () => {
      return {
        headers: {
          get() {
            return 'application/json'
          }
        },
        async json() {
          return { success: true }
        }
      }
    }

    const windowCtx = {
      fetch: fetchMock
    } as any as IWindowContext

    const fetchSpy = vi.spyOn(windowCtx, 'fetch')
    const body = { name: 'Test It!'}
    const stringyfiedBody = JSON.stringify(body)
    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json",
    }
    const api = createRequestViaWindow(windowCtx)
    const vals = Object.keys(api).filter(m => m !== 'get').sort().map(key => api[key])

    const calls = fetchSpy.mock.calls
    for (const fn of vals) {
      const res = await fn('/somewhere', { name: 'Test It!'})
      expect(res).toEqual({ success: true })
    }
    expect(calls[0]).toEqual([
      '/somewhere',
      {
        body: stringyfiedBody,
        method: 'DELETE',
        headers
      }
    ])
    expect(calls[1]).toEqual([
      '/somewhere',
      {
        body: stringyfiedBody,
        method: 'PATCH',
        headers
      }
    ])
    expect(calls[2]).toEqual([
      '/somewhere',
      {
        body: stringyfiedBody,
        method: 'POST',
        headers
      }
    ])
    expect(calls[3]).toEqual([
      '/somewhere',
      {
        body: stringyfiedBody,
        method: 'PUT',
        headers
      }
    ])

  })
})
