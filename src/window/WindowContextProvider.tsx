import * as React from 'react'

interface Props {
  children?: React.ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IWindowContext extends Window {
  // noop
}

export const WindowContext = React.createContext<IWindowContext>(undefined as unknown as IWindowContext)

export function WindowContextProvider(props: Props): React.ReactElement {

  const windowContextRef = React.useRef<IWindowContext>(typeof window !== 'undefined' ? window : undefined as any as IWindowContext)

  return (
    <WindowContext.Provider value={windowContextRef.current}>
      { props.children }
    </WindowContext.Provider>
  )
}


export function useWindow(): IWindowContext {
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
