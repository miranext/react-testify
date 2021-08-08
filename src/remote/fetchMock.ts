type Body = Pick<RequestInit, 'body'>


/**
 * Creates the body to return a json response
 * @param body
 */
export function jsonResponse<R>(body: R): Response {
  const res = new Response(JSON.stringify(body), {
    status: 200, statusText: "OK"
  })
  return res
}

type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
type MockResponse = {
  url: string
  method: string
  body?: Body
  response: Response
}
/**
 *
 * @returns
 */
export function fetchMockBuilder() {
  const responses = []

  return {
    onPostToOnce(url: string, withBody?: Body) {
      return {
        reply(response: Response) {
          responses.push({
            url, method: 'post', body: withBody, response
          })
        }
      }
    },
    onGetToOnce(url: string) {
      return {
        reply(response: Response) {
          responses.push({
            url, method: 'get', response
          })
        }
      }
    }
  }
}

export function fetchMock(responses: MockResponse[]) {
  const mfetch: Fetch = (input, init) => {
    // find this guy
    // input can actually be an object, for now only strings
    const imethod = init?.method || ''
    const method = imethod.toLowerCase()

    const matchingResponses = responses.filter(r => r.url ===  input && r.method === method)

    const oneMatch = matchingResponses.length === 1 ? matchingResponses[0] : undefined
    if (oneMatch && !oneMatch.body && method === 'get') {
      // return it
      return Promise.resolve(matchingResponses[0].response)
    }

    const matches: MockResponse[] = []
    for (const possibleResponse of matchingResponses) {
      // compare req body, FIXME: should all deep or partial match
      const initBody = init?.body
      const matcherBody = possibleResponse.body
      if (!initBody && !matcherBody) {
        matches.push(possibleResponse)
      } else if (initBody && matcherBody
          && (Object.entries(initBody).sort().toString()
            === Object.entries(matcherBody).sort().toString() )) {
        matches.push(possibleResponse)
      }
    }
    if (matches.length === 1) {
      return Promise.resolve(matches[0].response)
    }
    if (matches.length > 1) {
      return Promise.resolve(new Response(null, {
        status: 500, statusText: 'Not Found!'
      }))
    }
    return Promise.resolve(new Response(null, {
      status: 404, statusText: 'Not Found!'
    }))
  }
  return mfetch
}
