import * as React from 'react'

interface Props {
  children?: React.ReactNode
}

export interface IWindowContext extends Window {}

export const WindowContext = React.createContext<IWindowContext>(undefined as unknown as IWindowContext)

export function WindowContextProvider(props: Props) {

  const windowContextRef = React.useRef<IWindowContext>(typeof window !== 'undefined' ? window : undefined as any as IWindowContext)

  return (
    <WindowContext.Provider value={windowContextRef.current}>
      { props.children }
    </WindowContext.Provider>
  )
}


export function useWindow() {
  // check type as we might be called from server
  const context = React.useContext(WindowContext)
  if (context) {
    return context
  }
  // we could be rendered in backend
  // return the actual window?
  if (typeof window !== 'undefined') {
    return window
  }
  return undefined as any as IWindowContext
}
