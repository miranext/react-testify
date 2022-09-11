import * as React from 'react'

export type IFetchContext = Window['fetch']

export const FetchContext = React.createContext<IFetchContext>(null as any as IFetchContext)

export function FetchContextProvider(props: { children: React.ReactNode }) {

  const possibleWindow = (typeof window !== 'undefined' ? window : {})  as Window
  return (
    <FetchContext.Provider value={possibleWindow.fetch}>
      {props.children}
    </FetchContext.Provider>
  )
}

export function useFetch() {
  return React.useContext(FetchContext)
}


// fetchFaker
//   .onDoGet('/something')
//   .thenReturnJsonOkWithDataOnce()

//   //
//   .thenReturnJsonOkWithDataEvery()

// fetchFaker
//   .onDoPost('/something')
//   .havingBody()
//   .havingContaining()

//   .thenReturnOkWithJsonDataOnce()

//   .thenReturnOkWithJsonDataEveryTime()

//   .thenReturnJsonOkWithDataEvery([])
