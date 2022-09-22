import * as React from 'react'

export type IWebSocketContext = typeof globalThis['WebSocket']

export const WebSocketContext = React.createContext({} as IWebSocketContext)

export function WebSocketContextProvider(props: { children: React.ReactNode }) {

  const possibleWindow = (typeof global !== 'undefined' ? window : {}) as typeof globalThis

  return (
    <WebSocketContext.Provider value={possibleWindow.WebSocket}>
      {props.children}
    </WebSocketContext.Provider>
  )
}
