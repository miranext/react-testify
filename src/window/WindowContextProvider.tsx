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
  return React.useContext(WindowContext) || typeof window !== 'undefined' ? window : undefined
}
