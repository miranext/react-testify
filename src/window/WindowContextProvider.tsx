import * as React from 'react'

interface Props {
  children?: React.ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type IWindowContext = Window & typeof globalThis

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
  return React.useContext(WindowContext)
}
