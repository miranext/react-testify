import * as React from 'react'
import { WithChildrenProps } from "../types";
import { WindowContext, IWindowContext } from "./WindowContextProvider";

function createWindowProxy(partial : Partial<IWindowContext>): IWindowContext {

  const handler: ProxyHandler<IWindowContext> = {
    get: function(target, prop, receiver) {
      if (partial[prop as keyof IWindowContext]) {
        return partial[prop as keyof IWindowContext]
      }
      return Reflect.get(target, prop, receiver)
    }
  }
  const proxy = new Proxy(window, handler)

  return proxy
}
export type TestWindowContextProp = WithChildrenProps & Partial<IWindowContext>;

export function TestWindowContextProvider(props: TestWindowContextProp) {
  const { children, ...partialWindow } = props
  const windowContextRef = React.useRef(createWindowProxy(partialWindow))

  return (
    <WindowContext.Provider value={windowContextRef.current}>
      { props.children }
    </WindowContext.Provider>
  )
}
